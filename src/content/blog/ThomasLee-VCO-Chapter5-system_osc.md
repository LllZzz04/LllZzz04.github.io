---
title: "Thomas H. Lee - 压控振荡器 - Chapter 5 频率合成器"
description: "很基础的频率合成器知识和架构'"
date: 2026-9-6
tags:
  - 控制
  - 物理
  - 集成电路
draft: false

typora-root-url: E:/play_work/personal-site/public
---

## 分频器延迟

压控振荡器广泛运用于PLL（锁相环）中，因此本章节主要研究在锁相环中的一些分析

有关分频器延迟产生原因其实跟振荡器关系不大，但是它对振荡器危害比较大。这个名词说的是由于分频器一般采用的是数字器件，而有数字器件就要涉及到采样保持，在这个过程中产生的延迟会产生一定的相位误差，假设采样器的保持时间为T，那么相位延迟就是T/2，也就是说采样频率越高相位延迟就越低，很直观地看上去就是采样出来的时域波形与原频率更准确。

一般而言，为了减少采样电压翻转时的电压纹波调制PLL输出，环路交叉频率（近似认为是带宽）要设定为采样频率的1/10

## PLL结构

PLL是由VCO（压控振荡器）、PFD（鉴频鉴相器）以及divider（分频器）组成的环路反馈结构，主要是为了让输出频率跟踪输入频率的频率变化，我们分析一个架构就能快速明白：

<img
  src="/image/blog/Thomas_Lee/Chapter5/N-PLL.jpg"
  alt="N-PLL"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

如图是很经典的fractional-N-PLL，进入PLL的两个信号在锁定以后频率是相等的，因此会有表达式：

$$
\begin{aligned}
&\frac{f_{ref}}{N} = \frac{f_{out}}{M}\\
&f_{out}=\frac{M}{N}f_{ref}
\end{aligned}
$$

对这个环路而言，锁定以后的长期稳定性主要取决于参考频率的稳定性，因为相位差会被反馈所固定下来，这没什么好说的。

但是在短期内的分析就比较关键:

f_ref/N被称作这个系统的频率步进，也就是说当我想改变分频比的时候最小能改变f_ref/N。我们当然希望这个值能越小越好，很多系统也会要求对频率步进行设计。

然而，PLL的采样频率一般就是PFD的比较频率，也就是说同样是f_ref/N，一方面对于采样频率我们是希望越高越好，另一方面这个采样频率主要是限制了PLL的带宽，上面有说到PLL带宽最好设定为采样频率的1/10。

PLL的带宽受限的影响很多，其中一个是VCO的相位噪声，因为PLL是低通器件，而VCO是高通器件，因此远端的相位噪声其实是永远除不完的，只能尽可能减少，办法就是提高PLL带宽以及优化VCO相噪性能。PLL带宽变低这种远端相位噪声的影响自然就反应到了输出上。另一方面则是带宽比较大的话锁定时间比较短，因此在PLL上是希望带宽越大越好的。

频率步进与带宽的矛盾就是这个结构的最主要矛盾。因此为了解决这个问题，进化出了新的PLL形态：

<img
  src="/image/blog/Thomas_Lee/Chapter5/M-PLL.jpg"
  alt="M-PLL"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

这个结构我也不知道叫什么，总而言之输出变成了：

$$
\begin{aligned}
&\frac{f_{ref}}{N} = P\frac{f_{out}}{M}\\
&f_{out}=\frac{M}{NP}f_{ref}
\end{aligned}
$$

由于输入给PFD的参考信号依然是f_ref/N，因此采样频率是没有变的，对带宽的约束也因此没有发生改变，然而输出的频率步进却精细了P倍！这样就解决了上述的矛盾。

然而这个结构的代价就是所有的设备都要以P倍的频率运行，这对设计的要求是比较高的。

然后我们就会发现其实我们很难通过这个结构实现所有整数分频，因为N是固定的，因此为了实现连续的整数分频有了以下的结构：

<img
  src="/image/blog/Thomas_Lee/Chapter5/Integer-N-PLL.jpg"
  alt="Integer-N-PLL"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

其中图上的Divider Logic根据书上的内容应该是下面的结构：

<img
  src="/image/blog/Thomas_Lee/Chapter5/Integer-N-PLL-DIG.jpg"
  alt="Integer-N-PLL-DIG"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

大致上就是信号先经过一个双模的预分频器，在前S个周期中会实行N+1分频，直至swallow计数器计满，在后F-S个周期内会实行N分频，直到frame计数器计满。待两个计数器全部计满以后翻转一次电平。

这个结构总共的计数次数为：

$$
M=S(N+1)+(F-S)N
$$

因此分频比就是M。这个算式的分频比就很容易得到连续整数的分频了。

左右两侧同时除以F以获得归一化的表达式：

$$
\begin{aligned}
N_{eff} = (N+1)(\frac{1}{K})+N(1-\frac{1}{K})\\
f_{out}=N_{eff}f_{ref}=(N+\frac{1}{K})f_{ref}
\end{aligned}
$$

可以发现这样做也同时可以做到采样率与分辨率（最小步进）的解耦。

然而这样的做法其实在内部的电路上跟直接分频出同样整数的频率是不同的，因为它本质上是通过组合N+1分频与N分频在周期中的次数来实现的，因此这个问题会周期性地调制输出信号，从而出现边带。

解决方法书上提到的是一个是补偿，一般补偿能补偿到20dB-40dB，另一个是随机化切换模式，例如目前是前S次N+1后F-S次N，很有规律，这样就跟输出不正交，而随机化以后很大程度上能减小边带幅度，然而带来的问题就是会产生一定的噪底。更高阶的办法是用Δ-∑来进行噪声整形，把噪声放到高频上去再通过PLL的低通特性滤除。

<img
  src="/image/blog/Thomas_Lee/Chapter5/offset-PLL.jpg"
  alt="offset-PLL"
  style="width: 60%; display: block; margin: 1.5rem auto;"
/>

这是本章讲解的最后一个结构图，是偏置的频率合成环路，由于混频器是相当于把两个频率变成和频与差频量之和，而低通滤波器又可以滤除掉和频量，因此通过两个混频器＋低通滤波器的结构以后，输入给VCO的引导频率就是：

$$
\begin{aligned}
&f_1 = f_{out}-f_{ref}\\
&f_2 = f_1 - f_{offset} = f_{out}-f_{ref}-f_{offset}
\end{aligned}
$$

锁定情况下会使VCO的输入为0，即：

$$
\begin{aligned}
&f_2 =0\\
&f_{out} = f_{ref}+f_{offest}
\end{aligned}
$$

相比f_1=0(去掉偏置)的情况，输出也同样多了一个偏置，这是一个得到新的频率范围的好方法。

那这里可能有人就要问了，那我直接把这套混频+低通搬到输出后面不也一样吗？但是实际上用PLL自动跟踪能降低不少上变频带来的相位噪声杂散，反馈系统就是能在你不经意间带来些好处，此外还会有本振泄露，互调产物，参考泄露等等，我们这里直接让VCO在目标频率上震荡是最干净的。功率、线性度等等由于多了一级都不如直接VCO的输出。