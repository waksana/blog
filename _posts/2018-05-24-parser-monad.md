在看haskell的相关资料时，发现了一个有趣的系列，叫《functional pearl》里面的每一篇讲了函数式编程中的一个优美的小用法。我看了其中有一篇讲parser的。在这里总结一下。

haskell中可以定义一个`Parser Monad`。各种各样的`Parser`的组合可以表示`BNF`表达式。`Parser`是一个比较有意思的`Monad`。

```
newtype Parser a = Parser {parse :: String -> [(a, String)]}
```

我们定义的这个新类型是函数。这个函数输入一个字符串，从中解析出相应类型`a`的信息，之后返回类型为`a`的值和剩余待解析的字符串。函数的结果可能为多个值，所以使用数组表示。返回空数组代表解析失败。

然后我们可以将新得到的`Parser`类型实现为`Monad`。实现的思路很简单，就是依次运行两个parser。由于两个parser的结果都为数组，这边又用了数组`Monad`来实现多返回值的计算。

```
instance Monad Parser where
  return a = Parser \s -> [(a, s)]
  p >>= f = Parser (\s -> do {(a, s') <- parse p s; parse (f a) s'})
```

到此，我们可以使用`>>=`操作来顺序组合parser了。在`BNF`表达式中，除了顺序组合之外还用到了或运算。为了实现或运算，先让`Parser`实现为`MonadPlus`。

```
instance MonadPlus Parser where
  mzero = \_ -> []
  p `mplus` q = Parser (\s -> parse p s ++ parse q s)
```

`mplus`会把两个`Parser`的匹配都记录下来。当第一个`Parser`匹配失败时`mplus`的值就是第二个`Parser`。`mzero`是`mplus`的幺元。在实际使用中，常常只需要其中的一个匹配。于是就引入了`+++`操作：取第一个成功的结果。就相当于`BNF`表达式中的或运算。

```
(+++) :: Parser a -> Parser a -> Parser a
p +++ q = Parser (\s -> sHead $ parse (p `mplus` q) s)
  where
    sHead [] = []
    sHead (x:_) = [x]
```

我们现在尝试将`BNF`表达式翻译成`Parser`。

`BNF`表达式

```
expr ::= number add expr | number
```

`Parser`

```
expr = do {number; add; expr} +++ number
```

这里定义的`Parser`是有局限的，他无法表左递归的表达式。例如以下这个表达式使用`Parser`表现就会陷入无限循环。

```
expr ::= expr add number | number
```

从一个`Monad`出发，最后得到像`BNF`一样的表达式，`haskell`的抽象能力总是让我惊叹。如果两种语言表达同一种逻辑那他们的最简形式是否总是相同的？
