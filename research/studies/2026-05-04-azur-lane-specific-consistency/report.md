# 研究：碧蓝航线专项角色一致性

- **研究日期**：2026-05-04
- **研究方向**：以碧蓝航线角色为测试主体，研究其独特设计元素（舰装、船锚、海蓝色系等）在 GPT Image 2 中的稳定还原
- **选择理由**：最贴合用户实际需求。碧蓝航线角色设计具有高度辨识度（舰娘概念、舰装系统、KAN-SEN 标识等），需要研究这些元素如何被 GPT Image 2 理解和还原。信息源最少但用户价值最高。
- **涉及信息源**：[01], [02], [03], [04], [05], [06], [07], [08], [09], [10], [11], [12], [13], [14], [15], [16], [17], [18], [19], [20], [21], [22], [23], [24], [25]

## 来源

### 来源：项目魔导书——参考图工作流

根据 [01] 的指导：

**核心原则**
- IP 角色一致性应采用"参考图 + 场景编辑"两步工作流，而非纯文本反复生成。先创建纯净背景下的角色参考图，再用编辑端点将角色放入目标场景（来源 [01]）
- 每次只改一个变量（光线、构图、色彩、材质、文字），避免多变量同时改动导致角色漂移（来源 [01]）
- 一个 prompt 只放一个强风格锚点，避免混合多种风格导致输出不稳定（来源 [01]）

**技巧模式**
- 参考图 prompt 使用暖灰色摄影棚背景、标准三分之四站姿、柔和棚拍光，确保角色在纯净条件下被完整记录（来源 [01]）
- 场景编辑 prompt 开头声明"使用参考角色"，显式列出需保留的具体特征（脸、发型、服装、舰装、配饰），并限定"只改变环境和姿势"（来源 [01][05]）
- 在舰装角色场景中，舰装和标志性配饰必须出现在"保留"列表中（来源 [05]）

**反面案例**
- 不要用纯文本反复生成期望获得稳定的 IP 角色输出，编辑端点比生成端点更适合角色一致性场景（来源 [01][02]）
- 不要在参考图阶段使用戏剧化光线或复杂场景，会干扰后续编辑对角色外貌的提取（来源 [01]）

**可操作项**
- 将"参考图生成 → 场景编辑"作为碧蓝航线角色的标准工作流（来源 [01]）
- 参考图 prompt 中的角色描述可直接复用到后续场景编辑的"保留"列表中（来源 [01][04][05]）

---

### 来源：多参考图 API 能力

根据 [02] 的指导：

**核心原则**
- gpt-image-2 的 edit 端点支持多达 16 张参考图输入，远超常见认知（来源 [02]）
- 角色设计表（character sheet）可作为后续所有生成的唯一参考图，实现链式一致性（来源 [02]）

**技巧模式**
- 上传同一角色多角度官方立绘（正面、侧面、背面），让模型综合理解角色外貌（来源 [02]）
- 使用 Fresh Chat 策略：每次新对话配合参考图上传，避免长上下文漂移（来源 [02]）
- 编辑端点（edit）比生成端点（generate）更适合需要同时保持角色和风格的场景（来源 [02]）

**可操作项**
- 对碧蓝航线角色，可尝试上传多个角度的游戏官方立绘作为参考图组，提升角色理解度（来源 [02]）
- 将生成的角色设定页作为后续场景编辑的唯一参考源（来源 [02][06][07]）

---

### 来源：舰装设计分析

根据 [03] 的指导：

**核心原则**
- 舰装（rigging）是舰娘题材最复杂的视觉元素，需在 prompt 中单独作为一层描述，使用精确的海军装备术语（来源 [03]）
- 碧蓝航线舰装的三个区分特征：更华丽庞大、浮动式安装（悬浮于角色身后）、大量能量效果和发光元素（来源 [03]）

**技巧模式**
- 舰装描述应按照"整体形态 → 位置关系 → 材质细节 → 能量效果"的层级组织（来源 [03]）
- 使用精确术语而非模糊描述：flight deck structure / turret arrays / torpedo launchers / anchor chains（来源 [03]）
- 对碧蓝航线风格，必须加入能量效果描述（"glowing cyan coolant lines"、"energy beams"）（来源 [03][21]）

**反面案例**
- 不要用笼统的"mechanical parts"或"weapons"代替具体舰装描述，模型需要知道舰装的具体形态和位置（来源 [03]）
- 碧蓝航线舰装与舰 C 舰装的描述策略不同：前者强调华丽和能量效果，后者强调历史准确性（来源 [03]）

**可操作项**
- 建立碧蓝航线常见舰装元素的术语表（主炮塔/飞行甲板/鱼雷发射管/雷达天线/船锚链条），供 prompt 编写时直接引用（来源 [03]）

---

### 来源：Geniea 动漫角色设计指南

根据 [20] 的指导：

**核心原则**
- 动漫角色 prompt 应遵循五层结构：基础声明 → 构图情绪 → 光线描述 → 色彩系统 → 质量声明（来源 [20]）
- IP 角色应从简洁 prompt 开始，逐步添加细节——对碧蓝航线角色，先锁定核心外貌，再逐步添加舰装、配饰、阵营标识（来源 [20]）

**技巧模式**
- 使用"anime"等风格词引导模型产出日系动漫风格，这对碧蓝航线角色尤其重要（来源 [20]）
- 组合多种风格描述符获得动态结果，但不混合矛盾的风格（来源 [20]）

**反面案例**
- 碧蓝航线 prompt 特别容易"塞入太多概念"——角色描述 + 舰装描述 + 阵营标识 + 场景 + 动作，导致 prompt 过度复杂化（来源 [20]）
- 默认 1024x1024 很少适合舰装展示，竖版更适合展示全身+舰装（来源 [20]）

**可操作项**
- 碧蓝航线角色 prompt 应分层次组织信息：核心外貌（不可省略）→ 舰装（可简化）→ 阵营标识（视场景而定）（来源 [20]）
- 使用竖版比例（1024x1536 或更大）展示碧蓝航线角色的全身+舰装（来源 [04][20]）

---

### 来源：EvoLinkAI 动漫角色 Prompt 模式

根据 [21] 的指导：

**核心原则**
- 成功的动漫角色 prompt 遵循三层结构：完整角色 DNA → 环境描述 → 技术/渲染参数（来源 [21]）
- 极细粒度的外貌描述（皮肤质感、眼睛细节、发型动态、服装细节、配饰）是高保真角色的基础（来源 [21]）

**技巧模式**
- 舰装应作为角色 DNA 的独立层级，从整体形态到细节逐层描述（来源 [21]）
- 配饰描述应达到"带数量和位置"的精确粒度（来源 [17][21]）

**可操作项**
- 对碧蓝航线舰装角色，建立"文本 DNA"模板，包含从头到脚的完整视觉描述（来源 [21]）

---

### 来源：日系角色设定页模板

根据 [22] 的指导：

**核心原则**
- "professional Japanese character setting page" 可引导输出日系动漫设定风格（来源 [22]）
- "consistent proportions" 是日系角色表中强调最多的关键词（来源 [22]）

**技巧模式**
- 碧蓝航线角色设定页应在标准组件基础上增加：舰装结构分解（Rigging breakdown）、阵营标识特写（Faction emblem）、含舰装角色剪影（Rigging silhouette）（来源 [22]）
- 16:9 横版是日系设定页的常用比例（来源 [06][22]）

**可操作项**
- 碧蓝航线角色设定页应包含 8 个板块：转角度 / 表情 / 舰装分解 / 阵营标识 / 配饰特写 / 色板 / 剪影 / 服装分解（来源 [18][22]）

---

### 来源：角色一致性工作流（SelfieLab）

根据 [24] 的指导：

**核心原则**
- 角色一致性工作流分为三阶段：创建参考图 → 生成设定页 → 场景编辑（来源 [24]）

**技巧模式**
- 参考图阶段使用纯净背景、角色居中、全身可见、"clean character concept art style"（来源 [24]）
- 设定页要求"consistent proportions across all views"、多角度展示、表情和姿势变化（来源 [24]）
- 场景编辑使用"Using this reference image exactly for..."格式，声明"Maintain the exact same face, body proportions, and skin tone"（来源 [24]）
- 对碧蓝航线角色，每个阶段都需要额外处理舰装——舰装应从参考图阶段就完整包含，不要在后续阶段才添加（来源 [24]）

**可操作项**
- 舰装必须在参考图阶段就完整包含，确保它在设定页和场景编辑中被正确理解和保持（来源 [24]）
- 场景编辑的保留列表应额外声明"preserve rigging structure and faction accessories"（来源 [24]）

---

### 来源：风格迁移工作流

根据 [25] 的指导：

**核心原则**
- 编辑端点支持"保留风格、更换主体"——反过来也可以"保留角色、更换风格"（来源 [25]）

**技巧模式**
- 上传碧蓝航线官方立绘作为风格参考，使用"Use the same style from the input image"保持官方美术风格（来源 [25]）
- 碧蓝航线不同画师画风差异明显，如需保持特定角色的画风，可上传该角色的官方立绘作为风格参考（来源 [25]）

**可操作项**
- 对需要保持碧蓝航线官方画风的场景，可将官方立绘作为风格参考图输入（来源 [25]）

---

### 来源：多角色 IP 识别锚点

根据 [16] 的指导：

**核心原则**
- 多角色场景中，全局锁定格式、风格、环境，角色个体差异用微小标记物区分（来源 [16]）

**技巧模式**
- 使用"must remain perfectly consistent in every image"作为显式一致性声明（来源 [16]）
- 同阵营角色可将共享视觉元素（如白鹰的海军蓝配色）作为全局锁定，角色个体差异（发饰、武器类型）作为标记物（来源 [16]）

**可操作项**
- 碧蓝航线同阵营多角色场景应建立 DNA Template，包含阵营共享元素和角色个体标记物（来源 [16]）

---

### 来源：机甲少女文本 DNA 范例

根据 [15] 的指导：

**核心原则**
- 复杂机械装备的描述需要从宏观到微观逐层递进，每层都包含位置和材质信息（来源 [15]）

**技巧模式**
- 14 层文本 DNA 结构：身份 → 肤色 → 眼睛 → 发型 → 装甲 → 外套 → 武器 → 配饰 → 姿势 → 表情 → 环境 → 光线 → 镜头 → 渲染风格（来源 [15]）
- 每个机械元素都需要动态描述（"whipping in the sea wind"、"steam venting from her back thrusters"）（来源 [15]）
- 舰装按"整体形态 → 材质/颜色 → 关节/连接 → 能量效果 → 武器系统"的层级描述（来源 [15][03]）

**可操作项**
- 碧蓝航线舰装描述应达到机甲少女 prompt 同等的细节密度（来源 [15]）

## 发现

### 发现一：参考图工作流对碧蓝航线角色的一致性提升显著

[04] 到 [08] 的 Enterprise 系列测试展示了完整的工作流：纯文本参考图生成 [04] → 海战场景编辑 [05] → 设定页生成 [06] → 樱花场景编辑 [07] → 迭代优化 [08]。编辑模式下舰装一致性比纯文本生成显著提升 [05]。但复杂舰装细节（如飞行甲板的具体形态）在编辑后仍可能发生形变 [05]。

### 发现二：纯文本模式下角色信息密度不足导致识别度下降

[09] 到 [12] 的 Z52 水滑梯系列是纯文本生成（无参考图），角色描述被压缩到一行，缺少完整外貌描述、舰装描述和阵营标识 [09]。当角色在画面中占比很小（俯视鸟瞰 [10]）时，角色识别度进一步下降。但当角色占画面大面积（特写 [11]）时，纯文本也能达到较高的面部一致性。

### 发现三：参考图模式下 prompt 可以极简

[13] 展示了仅一行 prompt + 游戏立绘参考图的测试，角色面部和体型的还原度明显高于纯文本生成 [09]。但 prompt 中的新服装描述（"navy swimsuit"）会覆盖参考图中的军装，说明参考图模式下服装描述的优先级可能高于参考图本身 [13]。

### 发现四：标志性头饰是比舰装更稳定的识别锚点

[14] 的 Argus 测试和 [09][11] 的 Z52 测试共同表明，角色的标志性头饰（Enterprise 的猫耳/呆毛、Z52 的双马尾、Argus 的天线发饰）是比舰装更稳定、更容易还原的识别锚点。即使在完全省略舰装描述的休闲场景 prompt 中，发色+瞳色+标志性头饰的组合仍然能识别角色 [09][14]。

### 发现五：舰装描述需要独立的分层结构和术语体系

[03] 的舰装分析、[15] 的机甲少女范例、[08] 的迭代优化共同指向一个结论：舰装是碧蓝航线角色 prompt 中最复杂的部分，需要独立的分层描述结构（整体形态 → 材质 → 连接方式 → 能量效果），并使用精确的海军装备术语 [03][15][08]。模糊的"mechanical parts"描述无法稳定还原舰装的具体形态。

### 发现六：编辑模式下"Preserve/Change"显式分区结构是关键技巧

[05] 和 [07] 展示了"Preserve unchanged / Change only"的显式分区结构，这是处理碧蓝航线等复杂配饰 IP 角色的核心技巧。Preserve 区显式列出所有需要保留的角色特征（含舰装和标志性配饰），Change 区限定只改变环境、姿势和光线，最后用"Keep everything else the same"作为兜底指令 [05][07]。

### 发现七：角色设定页作为参考源的理论优势与实际验证

[06][07] 将角色设定页（而非单张参考图）作为编辑输入。设定页包含多角度信息，理论上应提供更完整的角色理解，但实际效果需要对比验证 [07]。设定页的布局设计（转角度 + 表情 + 服装分解 + 色板）对碧蓝航线角色需要额外增加舰装结构分解和阵营标识板块 [06][22][18]。

## 提示词结构拆解

### [04][08] Enterprise 参考图与设定页——同一角色的迭代 DNA

这两条 prompt 共同展示了 Enterprise 角色的文本 DNA 从初版 [04] 到迭代版 [08] 的演进过程。

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 两版均明确角色名（Enterprise）、IP 来源（Azur Lane）、阵营（Eagle Union）。迭代版 [08] 省略了中文名和部分外貌形容词，但增加了 bow-shaped weapon 这一核心识别特征 |
| 构图策略 | [04] 使用竖版全身参考图（1024x1536），标准三分之四站姿，暖灰色摄影棚背景。[08] 使用 16:9 横版设定页，左（转角度）右（色板+标签）布局，A-pose |
| 风格锚点 | 两版均使用"anime"作为唯一风格锚点，[08] 增加了"professional Japanese character setting page"和"clean line art" |
| 光线描述 | 两版均使用"even studio lighting, soft shadows"，避免戏剧化光线干扰角色记录 |
| 材质细节密度 | [04] 包含完整的外貌分层（Face/Hair/Body/Outfit/Accessories/Distinctive features），舰装描述为"aircraft carrier flight deck rigging on back (skeletal metal wings with red tips)"。[08] 将舰装调整为"aircraft carrier flight deck structure attached to arms and back, bow-shaped weapon"，更接近游戏实际设计 |
| 色彩策略 | [04] 显式声明色彩系统"navy-blue, silver-white, gold accents, black, gray-blue"。[08] 通过 6 色色板实现 |
| 文字规则 | [08] 包含文字标签"Front"、"Side"、"Back"、"Enterprise - Azur Lane"，[04] 声明"No text" |
| 失败规避 | 两版均声明"No text, no watermark, no extra props, no clutter"。[04][06] 还包含精确的解剖负面约束（"Natural hands, correct finger count, proper neck proportions"），针对复杂配饰导致的手部错误 |

---

### [05][07] Enterprise 场景编辑——参考图驱动的角色保持

这两条 prompt 共同展示了"Preserve/Change"显式分区结构在角色场景迁移中的应用。

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 不需要重新描述主体——开头声明"Using the reference character from the uploaded image/reference sheet"，依赖参考图提供角色信息 |
| 构图策略 | [05] 竖版（1024x1536），航母甲板场景。[07] 竖版（941x1672），日式花园场景。两版均由场景决定构图 |
| 风格锚点 | 不声明风格——继承参考图中的风格。这是编辑模式的特点：风格由参考图而非文本决定 |
| 光线描述 | [05] 使用"golden sunset lighting with dramatic clouds"（戏剧化海战场景）。[07] 使用"soft pink-tinted natural light"（柔和日常场景）。两版的光线差异大，但角色保持一致，验证了"一次只改一个变量"原则 |
| 材质细节密度 | 不描述材质细节——依赖参考图。但在 Preserve 区显式列出需保留的配饰（舰装、猫耳头带、船锚吊坠） |
| 色彩策略 | 不显式声明色彩系统——由场景自然光线决定色调 |
| 文字规则 | 不包含文字 |
| 失败规避 | "Keep everything else the same. Do not alter the character's identity, appearance, or outfit in any way"——兜底指令。[07] 特别保留"carrier rigging and cat ears headband" |

---

### [09-12] Z52 水滑梯系列——纯文本生成的动作一致性

这 4 条 prompt 共同特征：同一角色（Z52）在纯文本模式（无参考图）下的连续动作场景，测试纯文本模式在动态场景中的角色识别度。

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | 所有 4 条均使用"Anime illustration, Azur Lane Z52"作为开头，但在角色细节描述上逐步递增：[09] 仅"silver twin-tail hair and red eyes"，[10] 省略角色细节，[11] 增加发型动态和表情，[12] 增加发型状态变化（湿发）和更丰富的表情 |
| 构图策略 | 4 张使用 4 种不同构图：动作侧拍 [09]、俯视鸟瞰 [10]、腰部以上特写 [11]、横版落水镜头 [12]。构图差异极大，对纯文本一致性构成严峻挑战 |
| 风格锚点 | 统一使用"Clean anime linework, vibrant summer palette" |
| 光线描述 | 从基础的自然光 [09][10] 到逆光轮廓光 [11] 再到傍晚金色光 [12]，光线逐步戏剧化 |
| 材质细节密度 | 整体系列缺少舰装描述和阵营标识。[09] 特别指出这是有意的简化（泳装场景省略舰装）。缺少材质细节导致角色信息密度不足 |
| 色彩策略 | [10] 显式声明色彩系统"sky blue, turquoise water, navy, white, sunny yellow"作为系列一致性锚点。[12] 改为傍晚金色色调 |
| 文字规则 | 所有 4 条均声明"No text, no watermark" |
| 失败规避 | 无额外的失败规避声明。系列整体缺少对角色一致性的显式声明（如"maintain consistent appearance"） |

---

### [13][14] 参考图模式——碧蓝航线角色参考图策略

这两条 prompt 共同特征：使用参考图（游戏立绘）驱动生成，prompt 极简，测试参考图模式在碧蓝航线角色上的效果。

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | 依赖参考图提供角色信息。[13] 仅"Anime illustration, Azur Lane Z52 in a sporty navy swimsuit"一行。[14] 仅一行加发色和发饰描述。角色身份完全由参考图承载 |
| 构图策略 | 由场景决定：[13] 竖版落水镜头，[14] 横版温泉场景 |
| 风格锚点 | 统一使用"Clean anime linework" |
| 光线描述 | [14] 使用"Warm evening lighting"，[13] 未声明光线 |
| 材质细节密度 | 极低——所有细节依赖参考图。[14] 仅补充了"antenna-like strands"作为 Argus 标志性特征的文本提示 |
| 色彩策略 | [14] 未声明色彩系统，[13] 声明"vibrant summer palette" |
| 文字规则 | 两条均声明"No text, no watermark" |
| 失败规避 | 无额外失败规避。关键发现：参考图模式下 prompt 中的新服装描述（"navy bikini swimsuit"）会覆盖参考图中的军装 [13][14] |

---

### [15] 机甲少女海城——复杂机械装备的文本 DNA 范例

虽然是非碧蓝航线角色，但此 prompt 是舰装描述方法的最佳参考。

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 极高——"A mecha girl mid-teens"开篇，后续 14 层描述覆盖了角色每个视觉维度 |
| 构图策略 | "standing off-center to the left"、"medium-wide shot"、"slight low angle"——精确的构图指令 |
| 风格锚点 | "cinematic anime key visual, painterly digital illustration with crisp line art"——两个锚点不矛盾 |
| 光线描述 | 多光源系统："moody low-key lighting"（基调）、"cold teal ambient"（环境光）、"warm amber sodium glow"（暖光源）、"hard backlight from a low sun"（轮廓光）——四层光线描述 |
| 材质细节密度 | 极高——装甲用"matte gunmetal"描述质感，关节有"exposed hydraulic pistons"，胸甲有"glowing cyan coolant lines"，外套有"oversized oil-stained hangar jacket"，每个材质都有具体的视觉属性 |
| 色彩策略 | "desaturated oceanic palette of teal, bone-white and rust punched by small warm accent lights"——精确的色彩调性声明 |
| 文字规则 | "Format 16:9"——唯一的格式声明 |
| 失败规避 | 无显式失败规避，但极高的信息密度本身减少了歧义空间 |

---

### [16] 三胞胎姐妹 DNA Template——多角色 IP 识别锚点

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 极高——三姐妹的基础外貌完全一致，通过微小差异标记物（丝带/吊坠/日记本）区分角色身份 |
| 构图策略 | 全局锁定"cinematic horizontal composition with medium-wide shot" |
| 风格锚点 | 全局锁定"soft anime watercolor style, with gentle linework and muted pastel tones" |
| 光线描述 | 全局锁定"ambient diffused lighting, with no hard shadows or saturation changes between scenes" |
| 材质细节密度 | 中等——三姐妹的外貌描述粒度适中，服装描述简洁，依赖风格锚点补足视觉质感 |
| 色彩策略 | 全局锁定"soft, desaturated colors with gentle painterly effect" |
| 文字规则 | 格式锁定"wide size 3:2 aspect ratio" |
| 失败规避 | "Their appearance must remain perfectly consistent in every image"——显式一致性声明。"Keep all visual elements stable across images"——全局稳定性声明 |

---

### [17] 初音未来赛博朋克——已有 IP 角色的纯文本高保真还原

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 极高——核心识别锚点"long flowing teal twin-tails"是不可省略的 IP 标志。后续描述覆盖了从头到脚的每个视觉元素 |
| 构图策略 | "Dynamic mid-motion pose, body turned slightly right"、"low-angle shot centered composition"——精确的姿势和镜头指令 |
| 风格锚点 | "cyberpunk digital illustration" + "polished digital line art, smooth gradient shading" |
| 光线描述 | "Soft directional cool-toned lighting"——简洁但明确的光线方向和色温 |
| 材质细节密度 | 高——面料有"glossy circuit-textured fabric"，配饰有"gold headband with three circular gemstones (one purple center)"（带数量和位置的精确描述），皮肤上有"glowing teal circuit patterns overlaying skin" |
| 色彩策略 | 显式声明"Color palette: dominant teal, gold accents, white highlights, subtle orange warmth" |
| 文字规则 | 无文字 |
| 失败规避 | 无显式失败规避，但极高的信息密度和精确的色彩声明减少了歧义空间 |

---

### [18] 11 板块大师级角色参考表——最完整的设定页模板

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 极高——模板要求"Infer all missing details from the subject description"，确保角色信息的完整性 |
| 构图策略 | "4:3 horizontal layout"、11 个板块的精确布局规划、每个板块的尺寸占比要求 |
| 风格锚点 | [STYLE] 占位符，允许任意风格。模板特别声明"Apply [STYLE] only to the character and visual elements, not to the board layout or UI"——风格与 UI 分离 |
| 光线描述 | 模板本身不规定光线，但要求 MAIN IDENTITY 板块使用"realistic lighting" |
| 材质细节密度 | WARDROBE/ACCESSORIES 板块要求 4 个特写 callout（对碧蓝航线角色应增加到 6-8 个）。PROP 板块专门用于舰装。HAND GESTURES 板块覆盖手部细节 |
| 色彩策略 | COLOR PALETTE 板块要求 6-8 个色板 |
| 文字规则 | "All text must be clearly readable at normal viewing size. Avoid tiny or dense text" |
| 失败规避 | "no clutter, no watermark, no logo"——全局负面约束。"Keep the subject fully consistent across all panels"——显式一致性声明 |

---

### [19] 女性盗贼 T-pose 转角度——游戏角色 DNA Anchor 模式

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 使用"Identity anchors:"前缀标记角色的固定描述词——这是值得碧蓝航线角色借鉴的格式 |
| 构图策略 | "T-pose"、"3:2 aspect ratio"、"neutral gray background"、"front, three-quarter, and back views"——精确的转角度参数 |
| 风格锚点 | "professional game character concept art style" |
| 光线描述 | "realistic lighting with subtle rim highlights" |
| 材质细节密度 | 中高——"Dark leather armor with silver buckles"、"hooded cloak in deep forest green"、"high detail texture on leather and metal"——材质描述具体到材料和质感 |
| 色彩策略 | 通过服装描述隐含色彩系统（皮革暗色、森林绿、银色），未显式声明 |
| 文字规则 | 无文字 |
| 失败规避 | "Consistent proportions, exact same face and body across all views"——显式一致性声明 |

---

### [23] 奇幻战士 3x3 网格——参考图锚定的动作一致性

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 不依赖文本描述——"Using this reference image exactly for the character's face, build, and skin tone"，角色身份由参考图提供 |
| 构图策略 | "3x3 grid layout"、9 个动作编号明确指定（front standing / sword / shield / roar / kneeling / victory / rest）、"Clean grid layout with thin border lines" |
| 风格锚点 | "dark fantasy illustration, dramatic lighting" |
| 光线描述 | 合并到风格锚点中——"dramatic lighting" |
| 材质细节密度 | "detailed armor and weapons"——简洁但明确 |
| 色彩策略 | 无显式色彩声明 |
| 文字规则 | 无文字 |
| 失败规避 | "Maintain the exact same face, body proportions, and skin tone across all 9 panels. Do not change any character features"——针对多面板一致性的双重声明 |

## 提取的 pattern

### Pattern 1：碧蓝航线角色文本 DNA 模板

来源：[04][08][15][17][19]

碧蓝航线角色的文本描述应遵循分层结构，从核心识别锚点到外围细节逐层展开：

```
[角色名], [IP 来源], [阵营]
核心识别锚点（不可省略）:
  - 发色 + 发型 + 标志性头饰（如 ahoge / 双马尾 / 天线）
  - 瞳色 + 表情特征
  - 标志性配饰（如猫耳头带 / 船锚吊坠）
服装:
  - 整体风格（海军军官外套 / 驱逐舰制服 / 等）
  - 具体衣物列表（从上到下）
  - 材质和纹理描述
舰装:
  - 整体形态和位置（"on back" / "floating behind" / "attached to arms"）
  - 具体结构（飞行甲板 / 炮塔阵列 / 鱼雷管）
  - 材质和颜色（"skeletal metal" / "gunmetal"）
  - 能量效果（"glowing cyan coolant lines" / "energy beams"）
  - 武器系统（"bow-shaped weapon" / "rail cannon"）
体态: 身高、体型、肤色
色彩系统: 3-6 个核心色
```

---

### Pattern 2：参考图工作流（标准版）

来源：[01][02][04][05][24]

碧蓝航线角色一致性标准工作流：

1. **Step 1 - 参考图生成**（generate 端点）：
   - 纯净背景（暖灰色摄影棚）
   - 标准站姿（三分之四或 A-pose）
   - 柔和棚拍光
   - 包含舰装的完整角色描述
   - 声明"No text, no watermark, no extra props"

2. **Step 2 - 场景编辑**（edit 端点）：
   - 上传 Step 1 的参考图
   - 开头声明"Using the reference character from the uploaded image"
   - Preserve 区：显式列出需保留的角色特征（含舰装、标志性配饰、发色、瞳色）
   - Change 区：限定只改变环境、姿势和光线
   - 兜底声明"Keep everything else the same"

---

### Pattern 3：参考图工作流（增强版）

来源：[02][06][07][18][22][24]

在标准工作流基础上增加设定页中间步骤：

1. **Step 1** - 参考图生成（同标准版）
2. **Step 1.5 - 角色设定页生成**（generate 端点）：
   - 使用 Step 1 的参考图作为输入，或使用纯文本描述
   - 布局：16:9 或 4:3 横版
   - 板块：转角度 / 表情 / 服装分解（含舰装特写） / 色板 / 剪影
   - 碧蓝航线扩展板块：舰装结构分解 / 阵营标识特写
3. **Step 2 - 场景编辑**：
   - 使用设定页（而非单张参考图）作为编辑输入
   - 理论优势：提供多角度信息，角色理解更完整

---

### Pattern 4：参考图极简模式

来源：[13][14][25]

当有高质量游戏立绘可用时：

- 上传官方立绘作为参考图（支持 URL）
- prompt 仅需一行：角色名 + IP 来源 + 新场景/新服装
- 角色面部、发色、体型的还原度高于纯文本模式
- 注意：prompt 中的新服装描述可能覆盖参考图中的服装

---

### Pattern 5：Preserve/Change 显式分区结构

来源：[05][07]

适用于编辑端点的 prompt 结构：

```
Using the [reference character / character from the uploaded reference sheet], create [场景描述].

Preserve unchanged:
- Face, hairstyle (including [标志性头饰]), hair color, eye color
- Body proportions and skin tone
- Outfit design, colors, and all accessories
- [舰装描述], [标志性配饰1], [标志性配饰2]

Change only:
- Environment: [新环境]
- Pose: [新姿势]
- Lighting: [新光线]

Keep everything else the same. Do not alter the character's identity or appearance in any way.
```

---

### Pattern 6：舰装分层描述法

来源：[03][15][21]

舰装应作为独立层级描述，遵循以下递进结构：

```
整体形态: "[舰装类型] [位置]"
  例: "aircraft carrier flight deck rigging on back"
  例: "torpedo launcher arrays floating behind"
材质颜色: "[材质] [颜色]"
  例: "skeletal metal with red tips"
  例: "matte gunmetal armor plating"
连接方式: "[如何固定在角色身上]"
  例: "attached to arms and back via energy beams"
  例: "floating behind through magnetic levitation"
能量效果: "[发光/能量描述]"
  例: "glowing cyan coolant lines"
  例: "energy beams connecting rigging to character"
武器系统: "[具体武器]"
  例: "bow-shaped weapon"
  例: "massive rail cannon on right shoulder"
```

---

### Pattern 7：动态场景角色一致性策略

来源：[09][10][11][12][23]

在纯文本模式下实现动态场景中的角色一致性：

- 在系列首张 prompt 中建立完整角色描述，后续 prompt 可逐步省略细节（模型有短程记忆）
- 使用统一的风格锚点（"Clean anime linework, vibrant summer palette"）维持系列一致性
- 通过色彩系统间接维持一致性（显式声明主色和调性）
- 特写构图（腰部以上）可以提升角色面部识别度，但不适合展示舰装
- 当角色在画面中占比很小时，核心识别锚点（发色+瞳色）是最后的识别保障
- 建议在系列 prompt 中显式声明"maintain consistent character appearance"——[09-12] 缺少此声明，是一个改进点

---

### Pattern 8：碧蓝航线角色设定页布局

来源：[06][08][18][22]

针对碧蓝航线角色的设定页应包含以下板块（基于 11 板块大师模板扩展）：

```
标准板块（复用通用模板）:
1. 信息栏（名称、阵营、角色类型）
2. 色板（6-8 色）
3. 主身份 + 比例尺（正面 / 侧面 / 背面）
4. 表情系列（6-8 种）
5. 头部特写（多角度）

碧蓝航线扩展板块:
6. 舰装结构分解（整体形态 / 武器系统 / 能量系统 / 连接方式）
7. 阵营标识特写（鹰徽 / 铁十字 / 皇冠等）
8. 含舰装角色剪影（轮廓线对比——有舰装 vs 无舰装）

复用板块:
9. 服装分解（含舰装特写 callout，增加到 6-8 个）
10. 配饰特写（猫耳头带、船锚吊坠、肩章等）
11. 手势（针对复杂配饰导致的手部错误）
```

---

### Pattern 9：多角色阵营一致性

来源：[16]

碧蓝航线同阵营多角色场景的 DNA Template 结构：

```
全局锁定（所有角色共享）:
- 画风: "anime, clean linework"
- 阵营配色: "[阵营主色调] as dominant palette"
- 环境: "[共享场景]"
- 一致性声明: "All characters must remain perfectly consistent in every image"

角色个体标记物（区分角色）:
- 角色 A: "[发色] [发型] [标志性头饰]"
- 角色 B: "[发色] [发型] [标志性头饰]"
- 角色 C: "[发色] [发型] [标志性头饰]"
```

## 验证结果

### Round 1（2026-05-04）

**测试主体**：Z52（Z23）from Azur Lane（铁血驱逐舰）
**测试方案**：Step 1 纯净背景参考图 → Step 2 海战场景编辑（基于参考图）。跨舰种/跨阵营验证（vs Enterprise 白鹰航母）。

| 图片 | Step | 主体清晰度 | 构图 | 遵循度 | 材质质量 | 文字质量 | 稳定性 | 商业可用 | 总分 |
|------|------|-----------|------|--------|---------|---------|--------|---------|------|
| z52-reference-01 | Step 1 | 5 | 4 | 4 | 4 | null | null | 4 | 21/30 |
| z52-reference-02 | Step 1 | 5 | 4 | 4 | 4 | null | null | 4 | 21/30 |
| z52-naval-battle | Step 2 | 4 | 3 | 3 | 3 | null | null | 3 | 16/25 |

**Step 1 平均分**：21/30（70%）| **通过阈值**：21/30（70%）| **Step 1 结果**：✅ 刚好通过
**Step 2**：16/25（64%）| **结果**：❌ 未通过

**跨舰种对比**（Z52 vs Enterprise）：

| 维度 | Enterprise（航母） | Z52（驱逐舰） | 差异 |
|------|------------------|-------------|------|
| 阵营配色还原 | ✅ 白蓝金准确 | ✅ 黑红铁十字准确 | 持平 |
| 标志性头饰 | ✅ 猫耳+ahoge | ✅ 双马尾+发丝天线 | 持平 |
| 舰装可辨识度 | ✅ 高（航母甲板大且醒目） | ⚠️ 中（驱逐舰装小且密集） | 航母优于驱逐 |
| 场景编辑一致性 | ✅ 30/30 | ❌ 16/25 | 航母显著优于驱逐 |

详细评分见 `evaluations/round-1.json`。

## 结论

### 确认有效

1. **碧蓝航线专用 DNA 格式对角色核心特征还原有效**：银白双马尾、红眼、铁血黑红军装、铁十字标志等核心特征准确呈现。阵营配色还原与白鹰阵营同样可靠。
2. **标志性头饰是最稳定的识别锚点**：银白双马尾+发丝天线+红眼的组合在纯净背景参考图中保持良好。
3. **竖版比例（1024x1536）适合展示全身+舰装**：比正方形能更好地呈现舰装结构。

### 局限性

1. **驱逐舰小型舰装在复杂场景中一致性下降**：Z52 的驱逐舰舰装（鱼雷发射管、小口径舰炮）在海战场景中可见度和辨识度下降，航母舰装（Enterprise）在相同条件下表现显著更好。
2. **场景编辑的一致性保持策略对小型舰装不够充分**：Step 2 参考图编辑模式在驱逐舰上效果弱于航母，需要针对小型舰装增加更具体的描述锚点。
3. **仅验证了 1 个驱逐舰角色**：需要更多角色（重巡、轻巡、战列舰等）验证泛化性。

### 实际建议

- **航母/大型舰**：使用 `azur-lane-character-consistency` recipe + `reference-driven-character-consistency` recipe（已 confirmed），效果最佳。
- **驱逐舰/小型舰装角色**：在场景编辑的 Preserve 列表中增加更具体的舰装描述（如 "twin torpedo launcher tubes on back, small caliber naval guns on hip"），而非仅写 "rigging"。
- **本 recipe 保持 draft 状态**：核心策略有效但驱逐舰场景编辑一致性未达标，需要进一步优化。
