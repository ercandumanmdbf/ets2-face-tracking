# TruckLook

**由 ErcanDuman 开发。**

[English](../README.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Português](README.pt.md) · 中文 · [Türkçe](README.tr.md)

TruckLook 使用普通摄像头检测头部和眼睛运动，并将其转换为 Euro Truck Simulator 2 和 American Truck Simulator 中流畅的驾驶室视角。追踪数据通过本机 UDP 发送到 OpenTrack，再以 TrackIR 形式提供给游戏。

## 功能

- 头部姿态与虹膜辅助视线追踪
- 五秒可视校准，之后隐藏摄像头预览以降低渲染负载
- 请求最高 120 FPS 的摄像头流，并以 120 Hz 向 OpenTrack 输出插值数据
- 可调节头部灵敏度、眼动权重、平滑度和死区
- 可分别反转偏航、俯仰和翻滚轴
- 支持英语、德语、法语、俄语、西班牙语、葡萄牙语、中文和土耳其语界面
- 完全本地处理；摄像头画面不会被录制或上传

## 系统要求

- Windows 10 或 Windows 11
- 一个摄像头
- Euro Truck Simulator 2 或 American Truck Simulator
- [OpenTrack](https://github.com/opentrack/opentrack/releases)

## 安装与 OpenTrack 设置

1. 从 GitHub Releases 页面下载并运行 `TruckLook-0.2.0-x64.exe`。
2. 安装并打开 OpenTrack。
3. 将 **Input** 设置为 **UDP over network**，端口设置为 `4242`。
4. 将 **Filter** 设置为 **None**。
5. 将 **Output** 设置为 **freetrack 2.0 Enhanced**，并启用 TrackIR 接口。
6. 在 OpenTrack 中点击 **Start**。
7. 打开 TruckLook，选择摄像头，然后点击 **开始追踪**。
8. 在五秒校准期间注视屏幕中央，随后启动 ETS2/ATS。

游戏配置变量 `g_trackir` 必须设置为 `1`。初次使用时请保持 OpenTrack 映射曲线为线性：TruckLook 已经对姿态进行过滤并生成 120 Hz 数据流，再使用一个过滤器可能增加延迟。

## 使用 TruckLook

摄像头预览仅在校准期间显示。五秒后预览会隐藏，但追踪会继续在后台运行。随时点击 **重新居中**，即可再次显示摄像头五秒并设置新的中心位置。

| 设置 | 用途 |
| --- | --- |
| 头部灵敏度 | 放大实际的头部旋转 |
| 眼动权重 | 将虹膜计算出的视线方向加入摄像头运动 |
| 平滑度 | 减少抖动；数值越高越稳定，但延迟也越大 |
| 死区 | 忽略中心附近非常小的动作 |
| 反转轴向 | 分别反转左/右、上/下或翻滚方向 |

界面显示的 FPS 是实际摄像头处理帧率。TruckLook 会请求最高 120 FPS，但最终帧率取决于摄像头、驱动程序、照明和电脑性能。OpenTrack 输出仍会插值到 120 Hz。



## 许可证

MIT © 2026 ErcanDuman。MediaPipe 声明请参阅 [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)。
