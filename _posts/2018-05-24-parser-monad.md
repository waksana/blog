在看haskell的相关资料时，发现了一个有趣的系列，叫《functional pearl》里面的每一篇讲了函数式编程中的一个优美的小用法。今天介绍一下parser。

haskell中可以定义一个monad来做parser。各种各样的parser通过monad绑定的方式组合在一起可以解析一些复杂的语法文本。是一个比较有意思的monad。

```
newtype Parser a = Parser {parse :: String -> [(a, String)]}
```

我们定义的这个monad，是包了一个类型的函数。这个函数输入一个字符串，从中解析出相应类型`a` `的信息之后返回类型为`a`的值和剩余待解析的字符串。结果可能为多个所以由数组表示。解析失败则返回空数组。

然后我们可以将新得到的`Parser`类型实现为`Monad`。实现的思路很简单，就是依次运行两个parser。但是两个parser的结果都为数组，所以这边又用了数组`Monad`来实现多返回值的计算。

```
instance Monad Parser where
  return a = Parser \s -> [(a, s)]
  p >>= f = Parser (\s -> do {(a, s') <- parse p s; parse (f a) s'})
```

到此，我们可以使用`>>=`操作来顺序组合parser了。在bnf中，除了顺序组合之外还大量运用到了`|`或运算也就是并行逻辑，我们可以引入`MonadPlus`使用相加的方式来组合`Parser`。

```
instance MonadPlus Parser where
  mzero = \_ -> []
  p `mplus` q = Parser (\s -> parse p s ++ parse q s)
```

可以看到使用了mplus之后会把成功的匹配都记录下来，但是我们常常只需要其中的一个匹配就可以了于是就引入了`+++`操作，这个操作可以理解为当第一个`Parser`解析失败之后返回第二个`Parser`的结果。这才是我们真正想要的`bnf`中的`|`。

```haskell
(+++) :: Parser a -> Parser a -> Parser a
p +++ q = Parser (\s -> sHead $ parse (p `mplus` q) s)
  where
    sHead [] = []
    sHead (x:_) = [x]
```

我们现在尝试将`bnf`翻译成haskell `Parser`。

`bnf`版本

```
expr ::= number add expr | number
```

`haskell`版本

```
expr = do {number; add; expr} +++ number
```

但是现在定义的`Parser`是有局限的，无法表左递归的表达式。以下这个表达式在haskell中会陷入无限循环当中。所以当一个结构包含自身的时候就需要注意我们的`Parser`

```
expr ::= expr add number | number
```
