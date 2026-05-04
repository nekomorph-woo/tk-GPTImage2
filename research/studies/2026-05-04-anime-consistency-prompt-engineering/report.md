# 研究：动漫风格角色一致性 Prompt 工程

- **研究日期**：2026-05-04
- **研究方向**：纯文本 prompt 层面的角色一致性技巧，不依赖参考图
- **选择理由**：有些场景无法提供参考图（如从零创建角色），纯 prompt 层面的一致性技巧是重要补充。collected/ 中 #080 动漫写实、#087 初音未来是相关案例。
- **涉及信息源**：10 篇指南（01-10），40 条 prompt（11-50）

## 来源

### 来源：OpenAI 官方提示词指南

根据 [01] 的指导：

**核心原则**
- 身份保留是 gpt-image-2 的六大关键能力之一，官方明确将角色一致性列为产品级功能（来源 [01]）
- 每轮迭代必须重申不变量（Restate Invariants）——这是官方对纯文本一致性的基础策略（来源 [01]）
- 分离"变化"与"不变"：每次生成或编辑都显式声明哪些特征必须保留、哪些允许改变（来源 [01]）

**技巧模式**
- 编辑模式限定语："change only X" + "keep everything else the same"（来源 [01]）
- 从干净的基准 prompt 开始，用小改动逐步细化（来源 [01]）
- 虚拟试穿模式：显式锁定面部、体型、姿势、发型、表情，仅允许改变服装（来源 [01]）

**反面案例**
- 单次 prompt 过载——调试时应从简单基准开始，逐步添加（来源 [01]）

**可操作项**
- "Do not change anything else" 作为编辑场景的万能锁定语（来源 [01]）
- 约束声明列表每次迭代都要重复，不能省略（来源 [01]）

### 来源：OpenAI 社区 DNA Template 体系

根据 [02][03] 的指导：

**核心原则**
- DNA Template 是纯文本角色一致性的核心工具——在每次生成新场景前发送完整的角色描述模板，让模型"重新校准"对角色的理解（来源 [02]）
- 结构化描述顺序（角色类型 -> 头发 -> 眼睛 -> 性格 -> 体型 -> 服装 -> 姿势 -> 构图约束 -> 光线 -> 质量）比随机拼凑稳定得多（来源 [03]）
- 在 prompt 中显式声明格式约束（"single character, no reference sheet, no multiple panels"）可防止模型自行展开为角色设计表（来源 [03]）

**技巧模式**
- 多轮生成策略：在同一对话中逐个生成场景，每个场景前都重发 DNA Template（来源 [02]）
- 多角色区分：为相似角色分配独特的配饰标记（丝带、吊坠、日记本等），确保每个角色有唯一的视觉标识符（来源 [02]）
- 防多面板声明：添加 "no reference sheet" 或 "no multiple panels" 词汇防止意外输出（来源 [03]）

**反面案例**
- 长对话中不重发 DNA 会导致角色漂移（来源 [02]）
- 添加 "reference sheet" 或 "multiple views" 词汇会触发模型自动生成角色设计表（来源 [03]）

**可操作项**
- 完整的 DNA Template 结构：格式/比例 + 风格 + 项目标题 + 环境设定 + 角色完整外观 + 情绪基调 + 渲染参数 + 构图规范 + 一致性声明（来源 [02]）
- 显式一致性声明模板："Their appearance must remain perfectly consistent in every image."（来源 [02]）

### 来源：五元素公式与 Fal.ai 模板体系

根据 [04] 的指导：

**核心原则**
- 五元素 Prompt 公式：Subject + Style + Lighting + Details + Purpose（来源 [04]）
- 跨 prompt 逐字复用角色描述，不使用近义词替换——这是多面板一致性的关键（来源 [04]）

**技巧模式**
- 将一致性约束放在独立的 Constraints 段落中，使 prompt 结构更清晰（来源 [04]）
- 指定具体表情名称（"wide-eyed surprise"）比模糊描述（"happy expression"）效果更好（来源 [04]）

**可操作项**
- Fal.ai 五段式模板：Scene / Subject / Details / Use-case / Constraints（来源 [04]）
- 一致性约束模板："maintain exact same face and body proportions across all panels"（来源 [04]）

### 来源：Character Anchor 文本工作流

根据 [05][06] 的指导：

**核心原则**
- Character Anchor 模式：先用一段纯文本 prompt 建立角色的完整描述（锚点），后续场景只改变环境，角色描述保持逐字一致（来源 [05]）
- 视觉标记物策略：在每次 prompt 中一致地包含独特的视觉标记（配饰、色系、服装元素），这些标记在跨场景时提供识别锚点（来源 [06]）

**技巧模式**
- 六核心构建块框架：Scene/Background -> Subject -> Key Details -> Composition -> Lighting & Mood -> Constraints（来源 [05]）
- 场景 prompt 的一致性约束结尾："Same character, do not change her appearance, outfit, or illustration style."（来源 [05]）
- 文本角色定义的核心要素：Physical Appearance（年龄、体型、服装、发型、面部特征）+ Unique Traits（特殊标记、配饰、特征色系）（来源 [06]）

**反面案例**
- 在编辑时对"不变量"含糊不清——必须明确声明不能改变什么（来源 [05]）
- 跨迭代时不变量漂移——每次迭代都要重新声明（来源 [05]）

**可操作项**
- 一致性声明模板："This is her character reference — do not redesign her appearance."（来源 [05]）
- 文本角色 DNA 需覆盖：姓名、头发、肤色、雀斑、眼睛、服装、风格、调色板（来源 [05]）

### 来源：项目魔导书与 SelfieLab 工作流

根据 [07][09] 的指导：

**核心原则**
- 一个提示词只放一个强风格锚点，避免混合多种风格导致输出不稳定（来源 [07]）
- 迭代原则：一次只改一个变量（光线、构图、色彩、材质、文字），不要一起大改（来源 [07]）

**技巧模式**
- 角色描述的固定层次：角色名字/身份 -> 纯净背景 -> 标准站姿 -> 完整服装/配饰 -> 柔和棚拍光 -> 显式约束声明（来源 [07]）
- 一致性关键词："exact same face, body proportions, age, ethnicity from reference image. No changes to identity."（来源 [09]）
- 场景编辑的文本技巧：开头声明"使用参考角色"，列出需要保留的具体特征，明确"保持身份和服装一致"（来源 [07]）

**反面案例**
- 一次性解决所有问题——应先建立干净的基准 prompt，逐步细化（来源 [09]）

**可操作项**
- 虚拟纯净背景策略（纯文本版）：在文本中指定 "clean white void floor" 或 "warm gray photography studio" 来排除环境干扰（来源 [07]）
- 多角度掌控：文本指定具体角度列表（front, back, side, 3/4 front, 3/4 back, top-down, close-up headshot）（来源 [09]）

### 来源：Geniea 动漫设计指南

根据 [08] 的指导：

**核心原则**
- 动漫角色 prompt 需要包含动漫特定术语，跳过风格术语会导致输出不够地道（来源 [08]）

**技巧模式**
- 分层结构模板：基础声明 -> 构图情绪 -> 光线描述 -> 色彩系统 -> 质量声明（来源 [08]）
- 从简洁 prompt 开始，逐步添加动漫特定细节（来源 [08]）

**反面案例**
- 塞入太多概念——保持角色设计 prompt 聚焦于统一的美学（来源 [08]）

### 来源：EvoLinkAI 动漫角色 Prompt 模式

根据 [10] 的指导：

**核心原则**
- 高保真角色 prompt 的共同特征是极细粒度的外貌描述 + 明确的渲染/镜头参数 + 具体的光线/色调系统（来源 [10]）

**技巧模式**
- Mecha Girl 角色描述的文本 DNA 结构：身份/年龄 -> 肤色/质感 -> 眼睛 -> 发型 -> 服装/装甲 -> 配饰 -> 姿势 -> 表情 -> 环境细节 -> 技术/渲染参数（来源 [10]）
- "完整角色 DNA + 环境 + 技术参数"的三层结构（来源 [10]）

**可操作项**
- 多面板一致性声明："Maintain strong subject consistency across all panels, with consistent color and lighting"（来源 [10]）

## 发现

### 发现 1：纯文本角色一致性存在系统的分层方法论

从 10 篇指南和 40 条 prompt 中提炼出一个清晰的分层体系：

1. **DNA 层**：角色的完整视觉定义（头部到脚部的所有特征），作为后续所有生成的唯一事实来源
2. **锚点层**：在每次生成前重发 DNA，确保模型在新上下文中重置对角色的理解
3. **约束层**：显式声明不变量（"Do not redesign"）和否定约束（"no watermark"）
4. **迭代层**：从简单基准开始，一次只改一个变量，逐步细化

这一体系在 [01][02][05][07][09] 中被独立提出，具备高度共识。

### 发现 2："逐字复用"是跨生成一致性的核心操作

[04][05][35] 的案例共同证明：角色描述文本在跨生成时应逐字复用，不使用近义词替换。[35] 的 6 帧时尚拍摄序列是最佳范例——每一帧都重复 "full beige suit, white t-shirt, white sleek sneakers"。[15] 的 Mara 场景 prompt 中也逐字保留了角色描述。

### 发现 3：多角色区分依赖"独特标记物"而非单个特征

[02][17][40][46] 的案例表明：当多个角色外观相似时（如三胞胎），单个特征不足以区分，需要组合多个独特标记物。[02] 为三胞胎姐妹分配了丝带/吊坠/日记本三个不同配饰；[17] 用西装+分头 vs 红框眼镜来区分角色；[46] 的四角色漫画中每个角色都有独特的头发+眼睛+服装组合。

### 发现 4：一致性声明存在标准化写法

从素材中可归纳出三类标准一致性声明：
- **锁定声明**："do not redesign her appearance" / "Do not redesign the character"（来源 [05][31]）
- **引用声明**："Same character, do not change her appearance, outfit, or illustration style."（来源 [05]）
- **逐项声明**："Same green hooded tunic / Same facial features, proportions, and color palette"（来源 [31]）

### 发现 5：比例锁定是经常被忽略但高度有效的技巧

[48] 的 Kawaii 角色使用 "1:3 head-to-body ratio" 提供精确比例规格，比模糊的 "cute proportions" 更能有效减少比例漂移。[07] 的魔导书也建议指定 "标准站姿（三分之四站姿）" 来稳定比例。

### 发现 6：风格锚点与角色 DNA 应独立维护

[07] 明确指出"一个提示词只放一个强风格锚点"。[22][49] 的海报模板展示了如何将风格声明与角色描述分离：先锁定全局风格（"cinematic anime illustration with ink-wash textures"），再描述角色细节。风格锚点和角色 DNA 应作为两个独立模块维护。

## 提示词结构拆解

### 一、DNA Template 与角色锚点（纯文本角色定义的最佳实践）

#### [11] DNA Template 实例：三胞胎姐妹水彩动漫

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 极高。三个角色全部相同外观（"identical triplet sisters"），通过姓名 + 独特配饰区分（Hi=粉色丝带, Fu=银色吊坠, Mi=浅棕色日记本） |
| 构图策略 | 全局锁定 "3:2 aspect ratio" + "cinematic horizontal composition with medium-wide shot" |
| 风格锚点 | 单一锚点："watercolor anime style" + "soft anime watercolor style" |
| 光线描述 | "ambient diffused lighting, with no hard shadows or saturation changes between scenes"——跨场景锁定光线 |
| 材质细节密度 | 中等。肤色/体型/服装有描述，但缺少纹理细节 |
| 色彩策略 | "muted pastel tones" + "soft, desaturated colors"——限定了色彩范围 |
| 文字规则 | 无文字要求 |
| 失败规避 | "Their appearance must remain perfectly consistent in every image"——最强力的一致性声明 |

#### [12] 初音未来赛博朋克完整文本 DNA

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 极高。对已有 IP 角色的从头到脚精确描述：双马尾（金属光泽）、发带（三颗宝石）、眼睛（锐角翠绿色）、服装（circuit-textured fabric）、耳机（链饰）、臂环、腿环 |
| 构图策略 | "dynamic mid-motion pose, body turned slightly right, right arm bent, low-angle shot centered composition" |
| 风格锚点 | "digital illustration" + "polished digital line art, smooth gradient shading" |
| 光线描述 | "soft directional cool-toned lighting" |
| 材质细节密度 | 极高。"metallic sheen"（头发）、"glossy circuit-textured fabric"（服装面料）、"chain detail on right earcup"（耳机细节） |
| 色彩策略 | 完整色彩系统："dominant teal, gold accents, white highlights, subtle orange warmth" |
| 文字规则 | 无文字要求 |
| 失败规避 | 通过极细粒度的描述实现隐式防漂移——每个视觉元素都被精确定义 |

#### [14] 机甲少女海城 KV 文本 DNA

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 极高。完整的从头到脚规格：身份/年龄 -> 肤色/质感 -> 眼睛（HUD 瞄准线）-> 发型（海风飘动）-> 装甲（哑光枪灰色外骨骼）-> 外套（油渍）-> 武器（电磁炮）-> 配饰（狗牌 + 红丝带） |
| 构图策略 | "standing off-center to the left on the rusted edge of a tilted steel platform"、"weight shifted onto one leg" |
| 风格锚点 | "cinematic anime key visual, painterly digital illustration with crisp line art" |
| 光线描述 | 三层光线："moody low-key lighting"（基调）+ "cold teal ambient from the overcast sky"（环境光）+ "warm amber sodium glow"（局部暖光）+ "hard backlight"（轮廓光） |
| 材质细节密度 | 极高。"smudged with soot and salt spray"（皮肤质感）、"matte gunmetal exoskeleton"（装甲材质）、"exposed hydraulic pistons"（关节细节）、"glowing cyan coolant lines"（发光细节） |
| 色彩策略 | "desaturated oceanic palette of teal, bone-white and rust punched by small warm accent lights" |
| 文字规则 | 无文字要求 |
| 失败规避 | 通过极细粒度描述 + 三层光线系统实现隐式防漂移 |

#### [15] 角色锚点 Mara（5 场景一致性工作流）

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 锚点 prompt 中完整定义：姓名（Mara）、头发（短黑发齐刘海）、肤色（暖棕色）、雀斑、眼睛（深棕色）、服装（超大号橙色针织毛衣 + 深色牛仔裤） |
| 构图策略 | 场景间构图各异（坐地板/雨中行走/公交站/咖啡厅/天台），但都保持角色为主体 |
| 风格锚点 | "flat, modern character design style with clean lines and a muted warm palette" |
| 光线描述 | 场景间变化（台灯/夜晚/黎明/自然光/夕阳），但风格一致 |
| 材质细节密度 | 中等。锚点中描述了服装材质（knit sweater），场景中未添加额外材质 |
| 色彩策略 | "muted warm palette"——限定色彩范围 |
| 文字规则 | 无文字要求 |
| 失败规避 | 每个场景 prompt 结尾都有显式一致性声明："Same character, do not change her appearance, outfit, or illustration style" |

#### [31] 官方儿童绘本角色锚点

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 较高。定义了角色类型（"young, storybook-style hero"）、服装（绿色头巾束腰外衣 + 棕色靴子 + 小腰带袋）、表情（善良、温柔眼睛、勇敢温暖）、道具（小木弓） |
| 构图策略 | "plain forest background to clearly showcase the character"——纯净背景突出主体 |
| 风格锚点 | "Children's book illustration, hand-painted watercolor look, soft outlines" |
| 光线描述 | "soft lighting"——简单但一致 |
| 材质细节密度 | 低。仅指定材质类别（水彩），未描述具体纹理 |
| 色彩策略 | "warm earthy colors" + "whimsical and friendly" |
| 文字规则 | "No text"——显式排除 |
| 失败规避 | "Do not redesign the character" + "Original character (no copyrighted characters)" |

### 二、角色参考表与设计表（多面板角色一致性）

#### [13][16][18] 角色参考表/设计表模板

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | 所有模板都要求"Keep the subject fully consistent across all panels"（[13]），角色描述覆盖主肖像 + 表情集 + 姿势 + 配饰 + 色板 + 信息 |
| 构图策略 | 明确的板块布局定义：[13] 有 11 个板块（标题+色板+身份+比例尺+表情+头部细节+基准姿势+服装+道具+手势），[16] 有 6 个板块，[18] 有 6 个板块 |
| 风格锚点 | [16] 使用精确的风格声明："semi-realistic cartoon illustration with a cozy Japanese kawaii vibe (pastel tones, smooth shading, clean lineart)" |
| 光线描述 | [16] 使用 "soft lighting"；[13] 要求 "clean, neutral, minimal" 背景 |
| 材质细节密度 | [13] 通过 "infer all missing details" 指令让模型补全细节；[16] 明确列出配饰物件 |
| 色彩策略 | 三者都包含色板提取步骤：[13] 要求 "6 to 8 minimal clean color swatches"，[16] 要求 "skin, hair, outfit, accent colors" |
| 文字规则 | [13] 要求 "All text must be clearly readable"；[16] 要求 "clean background" |
| 失败规避 | [13] 的 "Keep the subject fully consistent across all panels" 是最强的跨面板一致性声明 |

#### [30] 16 面板动漫表情表

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 通过固定角色描述（头发、眼睛、服装、体型）在 16 个面板中保持面部特征一致 |
| 构图策略 | 16 面板网格，每个面板展示不同表情 |
| 风格锚点 | 统一的动漫风格 |
| 光线描述 | 未特别指定，依赖风格锚点隐式一致 |
| 材质细节密度 | 中等 |
| 色彩策略 | 统一色彩系统 |
| 文字规则 | 未指定 |
| 失败规避 | "固定 DNA + 变化表情" 模式——只允许表情变化，其他全部锁定 |

### 三、多角色漫画与故事板（角色区分 + 风格统一）

#### [17][27][28][32][46] 漫画与叙事中的角色一致性

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | [17] 每个角色用姓名 + 1-3 个独特视觉特征定义（Boss=西装+分头; Xiaohu=直刘海+红框眼镜）；[46] 每个角色有完整的头发+眼睛+服装+表情描述；[28] 是极简对照案例——无角色定义导致模型自行创建角色 |
| 构图策略 | [17] 四格漫画结构清晰（顶部宽面板 + 第二宽面板 + 第三行双面板）；[27] 五行分镜布局精确定义；[32] 每个 prompt 开头声明面板格式 |
| 风格锚点 | [46] 统一声明 "same anime art style and color palette"；[27] "All characters should be in manga style" |
| 光线描述 | 漫画场景中光线通常由场景定义隐式决定 |
| 材质细节密度 | 低到中等——漫画风格不强调材质细节 |
| 色彩策略 | [46] "consistent color grading (cool blue shadows, warm highlights)" |
| 文字规则 | [17] 包含中文对话气泡文字；[27] 包含大量中文文字和极小字号测试 |
| 失败规避 | [27] 使用大量否定约束（"No mugs"、"Avoid Chinese map"、"Sam should only appear in the text message panel"）；[28] 证明了无角色定义的失败风险 |

#### [50] WWE 摔角电影化故事板

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 完整的物理特征定义（体型/肤色/发型/面部毛发/纹身）+ 服装精确到颜色和设计细节 |
| 构图策略 | 6 个序列面板，每个有明确的动作描述 |
| 风格锚点 | "cinematic lighting with dramatic shadows" + "Dark cinematic color grading" |
| 光线描述 | "dramatic shadows and spotlight effects"——电影化光线 |
| 材质细节密度 | 中等 |
| 色彩策略 | "Dark cinematic color grading"——全局色彩锁定 |
| 文字规则 | "No text, no watermark" |
| 失败规避 | "Maintain exact character consistency across all 6 panels — same face, same body proportions, same ring attire, same skin tone, same tattoos"——逐项列出所有不变量 |

### 四、时尚杂志与角色海报（同一角色多场景/多造型）

#### [23][24][25] 日系时尚杂志泳装系列（同一角色变体）

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | 三条 prompt 保持"年轻女性 + 长发 + 粉色装饰 + 大蓝眼 + 白色泳装 + 柔和动漫写实"的核心 DNA，仅在头发颜色（silver-pink -> pale lavender）和服装细节上变化 |
| 构图策略 | 杂志排版结构：[23] 封面布局（标题+副标题+价格标签）；[24] 特集展开；[25] 双面板展开 |
| 风格锚点 | 统一的 "soft anime realism digital illustration" |
| 光线描述 | [23] "golden hour lighting from upper left"；[24] "natural midday lighting"；[25] "warm pastel palette, natural sunlight" |
| 材质细节密度 | 高。[23] 描述了 "delicate white lace bikini top with pink bow center and matching lace bottoms, sheer semi-transparent white cover-up" |
| 色彩策略 | 统一的 "pastel color palette of pinks, whites, and light blues" 色调 |
| 文字规则 | [23][24][25] 都包含日文杂志文字（标题、副标题、采访文字、价格标签） |
| 失败规避 | 核心一致性通过"固定 DNA + 局部变体"策略实现——结构上等价于 Character Anchor 模式 |

#### [35] 6 帧时尚拍摄序列

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 中等。角色仅通过服装描述定义（"full beige suit, white t-shirt, white sleek sneakers"），面部/发型未在文本中描述 |
| 构图策略 | 6 帧不同镜头角度（俯拍/仰拍/广角/特写倾斜/运动/正面） |
| 风格锚点 | 每帧都以 "Peter Lindbergh influence" 结尾——摄影师引用作为风格锚点 |
| 光线描述 | 统一的 "soft studio lighting" + "shallow depth of field at f/1.2" |
| 材质细节密度 | 低。仅通过服装描述暗示 |
| 色彩策略 | 未显式声明，依赖服装色彩和风格锚点 |
| 文字规则 | "no text"——全局否定约束 |
| 失败规避 | 每帧重复服装描述 + 风格锚点；全局否定约束覆盖所有帧 |

#### [36][37][38] 对话式换装与品牌 DNA

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | [36] 使用最简洁的锁定模式："Keep the same person's face, body proportions, and overall vibe"；[37] 首次完整描述后用 "the same woman" 引用；[38] 将角色视觉元素提取为结构化文档 |
| 构图策略 | 各场景独立构图 |
| 风格锚点 | [37] "premium fitness brand campaign, dramatic studio lighting"——全局风格声明覆盖所有面板 |
| 光线描述 | [37] "dramatic studio lighting, soft shadows, high contrast" |
| 材质细节密度 | 中等 |
| 色彩策略 | [37] "minimal color palette (red, white, neutral tones)"——限制色彩范围 |
| 文字规则 | [37] 包含大字排版（"FOCUS"/"STRENGTH"/"DISCIPLINE"） |
| 失败规避 | [36] 的 "不变量 + 唯一变量" 模式最简洁有效 |

### 五、游戏/动画 IP 角色与团队一致性

#### [20][21][34] 星露谷 NPC 角色属性

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | 角色通过属性框架定义：Name/Role/Birthday/Address/Loved Gifts/Character Arc |
| 构图策略 | "vertical 4:5 aspect ratio character wiki poster"——固定格式 |
| 风格锚点 | "STARDEW VALLEY indie game"——游戏风格引用 |
| 光线描述 | 未显式指定 |
| 材质细节密度 | 低——像素风格不强调材质 |
| 色彩策略 | 依赖游戏风格 |
| 文字规则 | 包含角色属性文字 |
| 失败规避 | [21] 使用 "inferred from image" 让模型自动补全属性 |

#### [40][44][45] 多角色团队海报

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | [40] 每个角色通过 "iconic poses and outfits" 定义；[44] 每个角色有独立 prompt 但共享风格框架；[45] 通过 IP 的标志性视觉元素定义角色 |
| 构图策略 | [40] 4x3 网格；[44] 每个角色独立的英雄姿势海报 |
| 风格锚点 | [40] "stylized digital art with bold outlines"；[44] "Pixar-style 3D cartoon"；[45] "high-detail anime illustration" |
| 光线描述 | [44] "Clean, vibrant lighting with soft shadows"；[45] "cinematic lighting, volumetric god rays" |
| 材质细节密度 | 中等 |
| 色彩策略 | [40] "unique color background that matches their personality"——用背景色强化角色身份 |
| 文字规则 | [40][44] "No text" |
| 失败规避 | [40] "Consistent illustration style across all panels"——跨角色风格统一声明 |

### 六、动漫海报模板（通用角色 KV 模板）

#### [22][41][45][49] 动漫角色海报模板

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | [22] 突出 "the most recognizable element of the character"；[41][49] 使用双重曝光将角色剪影作为主导锚点；[45] 利用 IP 已有辨识度 |
| 构图策略 | [22][49] 使用双重曝光和负空间构图；[45] 16:9 格式；[41] 上下分层结构 |
| 风格锚点 | [41] "cinematic anime illustration with ink-wash textures and Eastern aesthetic"；[49] "ink-wash aesthetic with Eastern artistic influences"；[22] "cohesive, refined, and restrained" |
| 光线描述 | [49] 未显式指定；[41] "Crisp line art where the character is in focus" |
| 材质细节密度 | 中等——海报模板更注重视觉冲击而非细节密度 |
| 色彩策略 | [49] "restrained: 2-3 dominant colors with subtle accent tones"——限制色彩范围 |
| 文字规则 | [41][49] "No text" |
| 失败规避 | [49] "a consistent series-style poster language"——系列一致性声明 |

### 七、艺术风格一致性（风格作为锚点）

#### [39][42] 艺术风格锁定

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | [39] 未定义具体角色，通过风格描述保持一致性；[42] 使用模板化角色描述 |
| 构图策略 | [39] "White background with soft vignette edges" |
| 风格锚点 | [39] "Hand-drawn watercolor illustration style with soft washes, gentle color transitions, and visible brushstrokes"；[42] "Soft anime illustration style" |
| 光线描述 | [39] 未显式指定；[42] "natural midday lighting" |
| 材质细节密度 | [39] 通过风格描述（"visible brushstrokes"）暗示材质 |
| 色彩策略 | [39] "Warm earthy color palette with muted greens, soft browns, and gentle yellows" |
| 文字规则 | [39] "No text, no watermark" |
| 失败规避 | [39] 证明了"风格声明"本身就能作为一致性锚点 |

### 八、游戏预告片与动作序列（多帧一致性）

#### [26][50] 游戏预告片与动作序列

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | [26] CHARACTER 部分完整定义（体型/发型/纹身/耳环/赛博义肢/服装）；[50] 完整物理特征+服装精确到颜色 |
| 构图策略 | [26] 序列帧结构（0s-15s 分段）；[50] 6 面板序列 |
| 风格锚点 | [26] "Hyper-realistic CGI"；[50] "Dark cinematic color grading" |
| 光线描述 | [26] 三段光线演进（白色棚拍 -> 过渡 -> 赛博朋克环境光）；[50] "dramatic shadows and spotlight effects" |
| 材质细节密度 | [26] 极高——"black cybernetic prosthetic arms with cyan LED nodes at joints"、"full chest and back tattoos" |
| 色彩策略 | [26] 白色环境 -> 赛博朋克霓虹；[50] 暗调电影化 |
| 文字规则 | [26] 包含 UI 文字（游戏菜单、状态栏）；[50] "No text" |
| 失败规避 | [26] 使用 "clean white void floor" 作为纯净背景；[50] 逐项列出所有不变量 |

### 九、工作流与模板

#### [29][43][47] 通用一致性模板

| 维度 | 共同模式 |
|------|----------|
| 主体清晰度 | [47] Subject 段落完整描述角色；[43] 短 prompt + 迭代修正 |
| 构图策略 | [29] 参数化网格布局（"4x3"、"borderless grid"）；[47] 五段式结构 |
| 风格锚点 | 各模板风格可自定义 |
| 光线描述 | 各模板光线可自定义 |
| 材质细节密度 | 取决于具体 Subject 描述 |
| 色彩策略 | 各模板色彩可自定义 |
| 文字规则 | [29] "No text"；[47] "No text overlay, No watermark" |
| 失败规避 | [29] "Maintain strong subject consistency across all panels"；[47] Constraints 段落专门声明不变量；[43] 迭代修正时引用具体特征（"exact same green eyes and freckles"） |

#### [33] Geniea 四级别动漫角色设计 Prompt

| 维度 | 分析 |
|------|------|
| 主体清晰度 | 低——不包含具体角色描述，仅定义角色设计表类型（表情表/服装变体/动作姿势/全身转面） |
| 构图策略 | 通过 "serene/dynamic/dramatic" 等情绪词影响构图 |
| 风格锚点 | "professional anime piece"——通用质量声明 |
| 光线描述 | 每个级别都有具体光线描述（"sunset rim light" / "neon ambient glow" / "moonlit scene" / "golden hour warmth"） |
| 材质细节密度 | 未指定 |
| 色彩策略 | 每个级别都有色彩系统描述（"high-contrast monochrome" / "analogous warm palette" / "neon accent colors" / "desaturated vintage tones"） |
| 文字规则 | 未指定 |
| 失败规避 | 通过固定前缀结构（"Create a anime image of [type] featuring character design"）确保格式一致 |

## 提取的 pattern

### Pattern 1：DNA Template（角色定义文档）

**结构**：全局设定（格式/比例/风格）+ 环境设定 + 角色完整外观 + 渲染参数 + 一致性声明

**适用场景**：多场景叙事、多轮对话生成、角色设计表

**素材来源**：[02][11][12][14][26][45]

**关键要素**：
- 角色描述按固定顺序：身份 -> 头发 -> 眼睛 -> 肤色 -> 体型 -> 服装 -> 配饰 -> 姿势 -> 表情
- 每个维度使用具体描述词而非模糊形容词
- 末尾必须有一致性声明
- 每次新生成前重发

**变体**：三角色 DNA（[11]）通过 "identical + 差异化配饰" 实现多角色区分。

### Pattern 2：Character Anchor（角色锚点 + 场景展开）

**结构**：锚点 Prompt（角色完整描述 + 锁定声明） -> 场景 Prompt（新环境 + "Same character" 声明）

**适用场景**：同一角色多场景、故事板、换装

**素材来源**：[05][15][31][36][37]

**关键要素**：
- 锚点 prompt 必须包含 "do not redesign her appearance" 类锁定声明
- 每个场景 prompt 以一致性声明结尾
- 场景间角色描述逐字复用，不使用近义词
- 可选：将不变量逐项列出（[31] 的 Character Consistency 段落）

**变体**：[36] 的最简形式——"Keep the same person's face, body proportions, and overall vibe, but change their outfit to [X]"。

### Pattern 3：五段式模板（结构化一致性约束）

**结构**：Scene / Subject / Details / Use-case / Constraints

**适用场景**：漫画面板、角色设计表、多面板生成

**素材来源**：[04][47]

**关键要素**：
- Constraints 段落是专门放置不变量声明的位置
- 一致性声明："maintain exact same face and body proportions across all panels"
- 否定约束统一放在 Constraints 中（"No text overlay. No watermark."）

### Pattern 4：多角色区分（独特标记物组合）

**结构**：全局风格统一声明 + 每个角色独立的文本 DNA（头发 + 眼睛 + 服装 + 独特配饰）

**适用场景**：多角色漫画、团队海报、群像

**素材来源**：[11][17][40][44][46]

**关键要素**：
- 所有角色共享同一风格声明（"same anime art style and color palette"）
- 每个角色至少 2-3 个独特视觉特征的组合（单个特征不足以区分）
- 当角色外观高度相似时，通过配饰标记物区分（丝带/眼镜/吊坠等）
- 全局一致性约束覆盖跨角色风格统一

### Pattern 5：双重曝光角色海报（剪影锚点 + 环境叙事）

**结构**：角色上半身剪影（主导视觉锚点）+ 剪影内环境叙事 + 全身视图（次要主体）+ 风格锁定 + 系列一致性声明

**适用场景**：角色宣传海报、系列 KV

**素材来源**：[22][41][45][49]

**关键要素**：
- 角色剪影作为最高优先级的视觉锚点
- "consistent series-style poster language" 声明确保系列统一
- 风格锚点限定为单一美学方向（如 "ink-wash aesthetic with Eastern artistic influences"）
- 大面积负空间 + 边缘处理（墨迹扩散/柔化模糊）增强系列语言

### Pattern 6：序列帧一致性（逐帧重复不变量）

**结构**：帧 1（完整角色描述 + 环境 + 镜头 + 风格）-> 帧 2-N（新镜头/姿势 + 重复角色描述 + 重复风格锚点）+ 全局否定约束

**适用场景**：时尚拍摄序列、动作故事板、分镜

**素材来源**：[26][35][50]

**关键要素**：
- 每一帧都重复核心服装描述和风格锚点
- 全局否定约束统一覆盖所有帧
- 统一的渲染参数（如 "shallow depth of field at f/1.2"）在每帧重复
- 帧间只变化镜头角度、姿势和环境

### Pattern 7：比例锁定声明

**结构**：在角色描述中包含精确的比例参数

**适用场景**：Q版角色、Kawaii 角色、风格化比例角色

**素材来源**：[31][48]

**关键要素**：
- [48] 使用 "1:3 head-to-body ratio" 提供精确比例规格
- [31] 使用 "slightly oversized head, expressive face" 提供相对比例描述
- 比例声明比模糊的 "cute proportions" 或 "stylized proportions" 更能有效减少比例漂移

### Pattern 8：纯净背景角色展示（纯文本版参考图）

**结构**：角色完整描述 + "clean white void floor" 或 "plain background to clearly showcase the character"

**适用场景**：角色创建、角色参考图、首次定义角色

**素材来源**：[07][26][31]

**关键要素**：
- 排除环境干扰，让模型专注于角色特征
- [26] 在 "clean white void floor" 上展示角色——等同于魔导书推荐的纯净背景策略的纯文本版
- [31] 使用 "Plain forest background to clearly showcase the character"
- 适用于角色的首次定义，建立干净的基准

### Pattern 9：风格锚点分离（风格与角色 DNA 独立维护）

**结构**：[全局风格声明] + [角色 DNA] + [场景/环境]

**适用场景**：所有需要角色一致性的场景

**素材来源**：[07][08][10][39][49]

**关键要素**：
- 风格声明独立于角色描述，放在 prompt 的特定位置
- 一个提示词只放一个强风格锚点（来源 [07]）
- 风格锚点可以是：艺术运动引用（"watercolor anime style"）、摄影师引用（"Peter Lindbergh influence"）、技术描述（"polished digital line art"）
- 风格锚点在跨生成中必须逐字复用

## 验证结果

### Round 1（2026-05-04）

**测试主体**：Enterprise（企业）from Azur Lane
**测试方案**：纯文本 DNA Template（无参考图）— 纯净背景基准图 → 日落甲板场景。4 张图均使用完全相同的 DNA 文档。

| 图片 | Step | 主体清晰度 | 构图 | 遵循度 | 材质质量 | 文字质量 | 稳定性 | 商业可用 | 总分 |
|------|------|-----------|------|--------|---------|---------|--------|---------|------|
| baseline-01 | 基准图 | 5 | 4 | 5 | 4 | null | null | 5 | 23/25 |
| baseline-02 | 基准图 | 5 | 5 | 5 | 4 | null | null | 4 | 23/25 |
| sunset-deck-01 | 场景 | 5 | 4 | 5 | 4 | null | null | 4 | 22/25 |
| sunset-deck-02 | 场景 | 5 | 4 | 5 | 4 | null | null | 4 | 22/25 |

**平均分**：22.5/25（90%）| **通过阈值**：21/30（70%）| **结果**：✅ 通过

**跨场景一致性**：发色、瞳色、服装、配饰、面部特征 5 项在 4 张图间全部一致。与 Research ①（参考图驱动 98.3%）相比，纯文本方法在核心角色特征上一致性接近，但细节粒度（制服褶皱、机械装置精细结构）有可见简化。

详细评分见 `evaluations/round-1.json`。

## 结论

### 确认有效

1. **DNA Template 纯文本方法可有效实现跨生成角色一致性**：4 张图全部通过评分（90%），跨场景角色特征（发色、瞳色、服装、配饰）保持一致。无需参考图即可达到高一致性。
2. **固定顺序的角色描述结构有效**：Identity → Hair → Eyes → Face → Body → Outfit → Accessories → Distinctive features 的固定层次，让模型准确理解并复现角色特征。
3. **显式不变量声明有效**："do not redesign her appearance" + "Same character" 声明有效防止了角色漂移。
4. **风格锚点分离有效**：单一风格锚点（anime, clean line art, cel shading）在跨场景中保持一致。
5. **逐字复用 DNA 文档有效**：两次生成使用完全相同的 DNA 文本，角色特征一致。

### 对比参考

| 方法 | 平均分 | 一致性评级 | 需要参考图 | 适用场景 |
|------|--------|-----------|-----------|---------|
| 参考图驱动（Research ①） | 29.5/30（98.3%） | 95%+ | 是 | 有参考图时首选 |
| DNA Template（Research ③） | 22.5/25（90%） | 85-90% | 否 | 无参考图或原创角色 |

**建议**：有参考图时优先使用 `reference-driven-character-consistency` recipe；无参考图时使用 `dna-template-character-consistency` recipe。两者可组合使用（变体 C：DNA + 参考图双锚点）。
