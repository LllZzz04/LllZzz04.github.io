---
title: "Thomas H. Lee - 压控振荡器 - Chapter 2 Colpitts振荡器"
description: "第一个认识的振荡器"
date: 2026-08-27
tags:
  - 控制
  - 物理
  - 集成电路
draft: false

typora-root-url: E:/play_work/personal-site/public
---
## 什么是Colpitts


​正如下图所示，Colpitts总而言之是一个依靠电容变压器实现的正反馈电路，电容一方面作为谐振腔的一部分，另一方面作为反馈回路引入正反馈，要知道振荡器的起振条件就是要满足巴克豪森判据：总相移为0且环路增益为1。因此环路至少要是正反馈。

<img
  src="/image/blog/Thomas_Lee/Chapter2/Colpitts.png"
  alt="Colpitts oscillator"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

​   直接分析这个电路是很困难的，作者在这里对电路做了一些简化：在上一章的末尾我们求得了MOS管的Describe Function：
$$
G_m = \frac{2I_{BIAS}}{V1}
$$
​	也就是说这个状态下的MOS管可以看作一个跨导（栅极输入 漏极输出），然而这并不足以描述这整个电路，因为此时的源极还充当了电压反馈的路径，因此要考虑MOS管从G到S的等效：
$$
G_{gs}=\frac{I_{s,fundamental}}{V_1\cos{ωt}}
$$
​	我们知道Id≈Is，因此可以看作Ggs≈Gm

​	故而从S到G的等效就是其倒数，可以表示为一个电阻，如图所示：

<img
  src="/image/blog/Thomas_Lee/Chapter2/Colpitts_dengxiao1.png"
  alt="Colpitts equivalent circuit 1"
  style="width: 50%; display: block; margin: 1.5rem auto;"
/>

​	看起来依然比较难分析？文中进一步的解决方式是把Ri等效出来，这个变压器阻抗变换的方法在射频方面还蛮常见的，这里姑且大致推导一下：

​	当忽略端口负载时，两电容串联流过电流相等：
$$
\frac{V_{C2}}{Z_{C2}} = \frac{V_{tank}}{Z_{C1}+Z_{C2}}
$$
​	图中V1=Vc2，因此：
$$
V_1 = \frac{Z_{C2}}{Z_{C2}+Z_{C1}}V_{tank}=\frac{C_1}{C_2+C_1}V_{tank}
$$
​	为了保证功率守恒，要有：
$$
\frac{V_1^2}{R_i} = \frac{V_{tank}^2}{R_{i,eq}}
$$


​	代入即可得到：
$$
\begin{aligned}
&R_{i,eq}=(\frac{C_1+C_2}{C_1})^2R_i\\
&记系数n=\frac{C_1}{C_1+C_2}
\end{aligned}
$$
​	这样就能把电路简化成只有跨导器跟谐振腔的简单形式：

<img
  src="/image/blog/Thomas_Lee/Chapter2/Colpitts_dengxiao2.png"
  alt="Colpitts equivalent circuit 2"
  style="max-width: 100%; display: block; margin: 1.5rem auto;"
/>

​	由上面的结论，我们可以知道这个电路振幅V_tank：
$$
\begin{aligned}
&V_{tank}= 2I_{BIAS}R_{eq} =2I_{BIAS}[R||\frac{1}{n^2G_m}]=2(I_{BIAS})\frac{R}{1+G_mRn^2}\\
&再利用G_m = \frac{2I_{BIAS}}{nV_{tank}}\\
&即可化简出：\\
&V_{tank} = 2I_{BIAS}R(1-n)
\end{aligned}
$$
​	可以看出输出的振幅正比于偏置电流，电容分压比以及负载电阻R。

​	由于R控制着整个电路的Q值，所以R会设置的尽可能大，而电容的分压比又要用来控制负载效应（loading effect），因此一般通过调控I_BIAS来调控输出的振幅



## 起振，二级效应，细致分析

### 起振

​	虽然前面一直有强调振荡器要使用大信号模型分析不过，仅仅在分析起振的时候，电路的确处于一个小信号状态，输出幅度变化会逐渐增大，然后脱离小信号方程的计算范畴。

​	然而之前的部分分析例如阻抗变换还是通用的，负载并没有发生变化，因此要进行更改的只有把Gm换成gm

<!-- 4. 起振小信号等效 -->
<img
  src="/image/blog/Thomas_Lee/Chapter2/Colpitts_dengxiao3.png"
  alt="Colpitts startup equivalent circuit"
  style="width: 50%; display: block; margin: 1.5rem auto;"
/>

​	起振条件就是谐振频率下环路增益大于1，此时LC阻抗抵消，都可以视作开路，因此：
$$
\begin{aligned}
&\frac{V_{return}}{V_1}=\frac{nV_{tank}}{V_1}=ng_mR_{eq}=g_m\frac{nR}{1+G_mRn^2}>1\\
&简化为：g_m>\frac{1}{R(n-n^2)}
\end{aligned}
$$

> 对于第一次设计而言，选择gm为最小值的5倍是比较合理的

​	接下来确定了gm与ID，对于管子Vd_sat也能进行确定，就可以设计出能够正常起振的Colpitts振荡器了

​	在设计中要注意平衡各个参数的关系，选取低偏置电流降低功耗则注定摆幅会减小，压缩Vd_sat，因此想要达到同样的gm，宽长比要比较大。


### 二级效应

​	即在前面为简化分析所忽略的因素，文章在这里也进行了叙述，这里就直接给出结论：

​	MOS的寄生电容，gd db端的电容都是并联在谐振腔上，gs sb则是并联在C2上，***因此只要简单地减少外接电容的取值即可降低影响***

​	MOS的输出阻抗，在高速（短沟道）器件中输出阻抗比较低，对负载影响较为严重，***某些情况下必须采用Casecode，计算时也要带上这个负载***


## Squegging

​	本书的中文译本翻译其为“非规则摆动”，用于描述振幅的不稳定性，接下来会分析Squegging，这里大部分采用逆推的方式来进行叙述：

​	首先我们的目标是求得电路的loop transmission，那么第一件事就是要简化电路，作者将电路简化成如下形式：

<img
  src="/image/blog/Thomas_Lee/Chapter2/Colpitts_dengxiao4.png"
  alt="Colpitts squegging equivalent circuit"
  style="max-width: 100%; display: block; margin: 1.5rem auto;"
/>

​	先来看Fig17.17，他的简化思路大概是把MOS管、谐振腔、反馈回路分开，这样断开节点可以求得开环增益，从而在根轨迹图上确认电路运行情况。

​	首先是谐振腔：由于反馈回路同时也具备着谐振腔的电容组件功能，分出去之后会缺少一个电容，因此作者补充了一个电容到谐振腔中，其容抗大小等于C1C2串联值

​	其次是反馈回路，说真的，这个部分的简化我最开始是真没看懂，因为这个A就已经是阻抗变换器的结果了，输入电压输出变换后的阻抗，后面的C我能理解为可能是想表示电流，用这个怎么算都算不出真正的电流来。

​	在该书中文版的脚注上有这样一句话：

> 这个分析基于下列文献的改造后的MOS版本:Kenneth K. Clarke 和 Donald T. Hess, Communicarions Circuits: Analysis and Design, Krieger, Malabar, FL, 1994.

​	看了这部分之后就知道虽然文中之前对Req做的等效实际上这只是一个近似，它假设了轻负载的情况，也就是输出端的负载可以忽略。

​	在这里我们假设这个负载为Y_L，先对左图的输出节点列KCL：
$$
\begin{aligned}
&v_sY_L+(v_s-v_d)sC_1+v_ssC_2&=0
\\&因此精确的电压传递函数为：\frac{v_s}{v_d}=\frac{sC_1}{Y_L+sC_1+sC_2}
\\&定义：A = \frac{C_1}{C_1+C_2}
\\&故原式可以写作：\frac{As(C_1+C_2)}{Y_L+s(C_1+C_2)},
\\&即：\frac{v_s}{v_d} = \frac{A}{\frac{Y_L}{s(C_1+C_2)}+1}
\end{aligned}
$$
​	既然是上述假设的轻负载情况，那么会有：Y_L << s(C1+C2)

​	因此：
$$
\frac{v_s}{v_d} ≈ A
$$
​	这也是前文电容等效变压器的近似由来。

​	再从输入端往里看：
$$
\begin{aligned}
i_d = sC_1(v_d-v_s)
\\&因此Y_{in} = sC(1-\frac{v_s}{v_d})
\\&即Y_{in} = sC_1(1-\frac{sC_1}{Y_L+sC_1+sC_2})
\\&整理Y_{in}=\frac{sC_1(sC_2+Y_L)}{Y_L+sC_1+sC_2}
\\&既然Y_L<<s(C_1+C_2)，令x=\frac{Y_L}{C_1+C_2}
\\&原式可以写成Y_{in}=\frac{sC_1(sC_2+Y_L)}{s(C_1+C_2)(1+x)}
\\&用一阶近似\frac{1}{1+x}≈1-x
\\&原式化简为\frac{C_1}{C_1+C_2}(sC_2-\frac{C_2Y_L}{C_1+C_2}+Y_L-\frac{Y_L^2}{s(C_1+C_2)})
\\&二次项直接省略
\\&将含Y_L的项统合到一起：Y_{in}=\frac{sC_1C_2}{C_1+C_2}+(\frac{C_1}{C_1+C_2})^2Y_L
\\&即Y_{in}≈C+A^2Y_L
\end{aligned}
$$
这看上去才是简化后A后面会有一个C的原因

换一种说法其实就是这个C是用来考虑Y_L的，也就是要把MOS作为负载考虑进去，***之前虽然等效看上去v_s = Av_d，但实际上这是一个近似，并非精确值，当然也不能直接拿A来当反馈系数***

然后原文又据此等效出了17.18这张图，这个等效还是很直观的，相当于反馈网络源极接入的mos管视作非线性负载。

简化完成之后就可以开始求解了，我们来逆向推理求解思路：

最终目的是获得传输函数，那么我就需要知道几个部分的东西：

1. 反馈网络的反馈系数
2. tank的传输系数
3. MOS的传输系数



虽然只是近似，但A仍然可以视作是反馈网络的反馈系数



***MOS的传输系数：***

这部分的求解要先分析引起震荡的成分，把i_L分成直流电流i_dc跟RF电流i_out,当输入发生v_in的不稳定时，直流电流与RF电流都会因为这个扰动而产生直接的影响，接下来由于I_dc发生了变化，因此图17.19中电容的电压也会发生变化（v_c）。也就是直流电压产生变化，这也会对直流电流与RF电流产生影响，因此把这些影响视作一个二端口网络：
$$
\begin{aligned}
&i_{dc}(s)=G_{00}v_c(s)+G_{01}v_{in}(s)\qquad(1)\\
&i_{out}(s)=G_{10}v_c(s)+G_{11}v_{in}(s)\qquad(2)
\end{aligned}
$$
看图17.19我们知道，直流源I_DC这条支路电流是恒定的，因此i_dc最终只会流向电容C引起电压变化：
$$
i_{dc} = -sCv_{c}(s)
$$
注意，该式是电流对电压的影响，(1)式描述的是电压对电流的影响，二者并不矛盾

因此代入原式即可求得
$$
\begin{aligned}
&-sCv_{c}(s)=G_{00}v_c(s)+G_{01}v_{in}(s)\\
&v_c(s)=\frac{-G_{01}}{sC+G_{00}}v_{in}(s)
\end{aligned}
$$
接下来替换(2)式中的v_c，这里直接给出结果：
$$
\frac{i_{out}(s)}{v_{in}(s)}=G_{11}-\frac{G_{01}G{10}}{sC+G_{00}}=G_{11}\frac{(\frac{sC}{G_{00}}+1)-\frac{G_{01}G_{10}}{G_{00}G_{11}}}{sC+G_{00}}
$$
观察发现这个反馈网络具有一个零点跟一个极点



至于这些电导值，也跟二端口网络的求解方式相同，计算另一输入为0时输出对输入在时域上的导数即可：

<img
  src="/image/blog/Thomas_Lee/Chapter2/G.png"
  alt="Small-signal G parameter analysis"
  style="max-width: 100%; display: block; margin: 1.5rem auto;"
/>

***接下来计算tank的传递函数***，tank是一个RLC并联谐振，因此是一个二阶系统，具有两个极点，但由于这里讨论的是谐振附近的大包络变化的响应，因此距离其中一个极点非常近，另一个极点由于距离在2ω左右，因此距离很远，该系统可以简化为一个一阶系统即：
$$
H(s) = \frac{K}{1+s/ω_p}
$$
K通过s=0的特征值求出直流状态下的tank阻抗，也就是
$$
K=R_T
$$
接下来求ω_p:
$$
ω_p=τ=\frac{BW}{2}=\frac{ω_0}{Q}=\frac{ω_0}{ω_0R_TC}=\frac{1}{R_TC}
$$
因此传递函数就是：
$$
\begin{aligned}
&H(s) =\frac{R_T}{1+sR_TC}\\
&即\frac{v_{tnk}(s)}{i_{out}(s)}=\frac{R_T}{1+sR_TC}
\end{aligned}
$$
因此，总体的环路增益为：
$$
A\frac{i_{out}(s)}{v_{in}(s)}\frac{v_{tnk}(s)}{i_{out}(s)}=A(G_{11}\frac{(\frac{sC}{G_{00}}+1)-\frac{G_{01}G_{10}}{G_{00}G_{11}}}{\frac{sC}{G_{00}}+1})\frac{R_T}{2sR_TC+1}
$$
这个系统有两个极点一个零点，这三个点的排布其中零点绝对不能位于最左侧，有兴趣可以计算下，因此会出现两种情况，即零点位于两个极点中间以及位于最右侧，我们现在分别讨论两种情况：

需要提前说明的是，这里的零点跟极点都是开环的传递函数的零极点，而**根轨迹绘制的是闭环情况下的极点运动**，这是因为开环零极点是闭环在增益为0时的特值，因此可以从这里出发。

先来讨论极点位于最右侧的情况，如下图所示：

<img
  src="/image/blog/Thomas_Lee/Chapter2/root_locus1.png"
  alt="Root locus case 1"
  style="max-width: 100%; display: block; margin: 1.5rem auto;"
/>

关于这个根轨迹是怎么绘制出来的我们有以下分析：

对于正反馈有：1-L(S)=0即：
$$
K\frac{s-z}{(s-p_1)(s-p_2)}=1\qquad其中，z是零点，p_1p_2是图中的两个极点
$$


先考虑根轨迹在实轴上的情况，发现要想满足总相位为0或360°，根轨迹右侧一定有偶数个极点或零点，因此实轴上根轨迹的取值：
$$
(z,+∞)\cup(p_1,p_2)
$$
当根轨迹在p1与p2之间运动时，一个极点从p1向p2运动，另一个极点从p2向p1运动，当撞到一起的时候这个点叫做breakaway point，从此开始会形成共轭极点，它们与零点之间的数学关系决定了这个轨迹一定是一个以零点为圆心的圆。

因此总体的根轨迹就如图所示，还记得上一章我们在讲零极点图的时候讲过什么吗？当极点位于右半平面时会不稳定，图中的圆有一部分位于右半平面，接下来我们来分析这部分：

假设这部分的极点为σ±jω_m，在时域中就会变成：
$$
e^σ\cos{ω_mt}
$$
由于在右半平面，σ>0,因此震荡会不断增大，但现实中最后会被物理限幅，假设这个最大的幅度为ΔA

电路由于该扰动就会输出成：
$$
(A+ΔA\cos{ω_mt})\cos{ω_0t}
$$
这种情况就是准正弦（sinusoidal）扰动，是导致squegging的一种原因



再来看另一种情况：

<img
  src="/image/blog/Thomas_Lee/Chapter2/root_locus2.png"
  alt="Root locus case 2"
  style="max-width: 100%; display: block; margin: 1.5rem auto;"
/>

还是使用先前的分析方法，这次极点的位置位于：
$$
(q_1,z)\cup(z,+∞)
$$
我们发现这次极点会一直位于实轴上

当极点在z到+∞的部分是会存在处于右半平面的情况的，因此对应的时域情况：
$$
e^{σt}
$$
两个极端都在实轴上，这种对环路源输出的影响我们称之为是驰豫（relaxation-like）型的

本章最后讨论的是如何降低这种Squegging，这里就直接给出结论：

***增加回路Q值，从而拉进两个极点之间的距离，从而降低圆半径***。可以提高phase margin，不过这个办法会降低谐振回路的带宽

***改变电容分压比来反馈较小的信号以减小环路传输系数***。这个办法不会降低带宽，当然，一般会结合使用各种策略

***采取外部电路通过反馈直接控制振幅***。很经典的测量、比较、调整系列办法。



