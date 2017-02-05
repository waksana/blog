OpenAL是一个神奇的库，他能够帮你播放三维空间中的声音。模拟出真实世界中声音的空间感。这一点是非常有意思的，一开始想想觉得实现三维音效很简单，只需要控制左右声道的音量和时间差就能产生空间感。可是仔细想想却有非常多的小问题，比如实时计算音量，移动物体的多普勒效应，就算是静态音源，要把音源的时间差和音量协调好还要做很多工作。当然，这是一个外行对三维音效的猜想，真正的实现可能要涉及到各种复杂公式。还好这一切有OpenAL帮助我们搞定，而更加好的是iOS本来就能够使用OpenAL库。

### 概念

*ALSource*是OpenAL的关键所在，他就好像是在虚拟三维空间中的喇叭，你可以把他放到空间中的任何一个地方去，改变他的速度和朝向。当参数改变了之后，播放的声音也就自然而然的改变了。

*ALListener*也就是倾听者，这个虚拟的三维空间没有中心点，声音的接受者也就是app的用户的位置和朝向也是能够改变的，listener和source的属性确定了声音是如何展现的。一个三维空间里只有一个listener，而source可以有多个。

上面讲的两个概念代表了OpenAL的基本功能。只了解这些显然是不够的，使用OpenAL还需要一些必要的步骤:

1. 获取设备的播放硬件ALCdevice
2. 创建一个基于设备的三维世界ALCcontext
3. 读取音频文件到ALBuffer
4. 创建若干个ALSource，并且配置source的物理属性和要播放的ALBuffer
5. 播放ALSource。ALSource和ALListener的物理属性可以被随时修改

### 一些坑

我对音频变成的陌生导致有些问题我很头疼，我总结了一下大概有几个坑:

首先是坐标系的问题。OpenAL采用了右手笛卡尔坐标系。拇指是X轴，食指是Y轴，中指是Z轴。衡量高度的不是Z轴，而是Y轴，这点和我的理解不太一样。在这个坐标系里，正面这个方向的矢量是(0, 0, -1)。

listener的朝向(AL_ORIENTATION)算是一个不太好理解的地方吧，我没有接触过OpenGL所以这些概念都不太明白。AL_ORIENTATION的值是两个正交的向量，第一个向量表示面对的方向，第二个向量比较有意思，我原来也想不到，这个向量的作用是标记头顶的方向。想想还真有道理，这个向量在OpenGL里应该比较容易想到，如果头顶向量不确定，那看到的场景可能会旋转。

最后是一个很低级但是新手很容易踩的坑。那就是当我改变source的位置时声音的位置听起来没有任何改变，查了半天发现是我的音源问题。如果你想让OpenAL起作用，你必须使用单声道的音频。这也显而易见，可这是一个非常容易犯的错误，而且很难找到问题。

### 第三方库

尽管OpenAL的API已经非常好用了，第三方库还是可以考虑的。因为OpenAL的C语言接口不太符合OC程序员的面相对象编程，加上各种返回值以指针的形式传递对swift更是不太友好。而第三方库就能弥补这些问题。更进一步，能更加贴近iOS。我使用的是ObjectAL这个库，已经有两年没有更新了，可是还是非常好用。希望作者不要抛弃他。

使用ObjectAL也存在一些问题，比如这个库没有很好的适应ARC，也可能是我使用不当。下面是一些使用库的OAL代码

    //swift
    //不允许其他后台播放
    OALSimpleAudio.sharedInstance().allowIpod = false

    //把文件载入到ALBuffer，并且转换成单音道的声音
    OALSimpleAudio.sharedInstance().preloadEffect("sound.caf", reduceToMono: true)

    //播放声音并且设定source的位置
    var source = OALSimpleAudio.sharedInstance().playEffect("sound.caf")
    source.position = ALPoint(x: 1, y: 1, z: 1)


    //at 表示朝向degree从正前方按照顺时针计算
    var at = ALVector(x: sin(degree), y: 0, z: -cos(degree))
    //up 表示头顶的向量是向上
    var up = ALVector(x: 0, y: 1, z: 0)
    //设置听者的朝向
    OALSimpleAudio.sharedInstance().context.listener.orientation = ALOrientation(at: at, up: up)
