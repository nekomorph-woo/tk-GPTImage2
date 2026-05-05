# 林黛玉葬花 — 工笔画题诗

## 源头  ⏺ 稳定

用户在社交媒体上看到别人讨论林黛玉，想起小学课本里的"林黛玉葬花"和葬花吟。虽然没怎么读过红楼梦，但知道黛玉的性子和身世，想要把"单薄女子树下葬花"的凄凉意境用一幅传统工笔画的形式呈现出来，像博物馆里保存完好的古画。

## 概念描述  ⏺ 稳定

像一幅被好好保存下来的古代工笔画——绢本上墨线勾出的一个极瘦的女人，穿着素淡的衣裳，微微低着头，手里攥着一小把已经蔫了的花。脚边散落着零星的花瓣，远处是一棵老树，枝条稀疏。整张画留白很多，颜色几乎是水墨的灰调，只有花瓣有一点淡淡的粉。画师画完之后在右上角题了葬花吟中最有代表性的两句，盖了红色的印章。不是一张旧画，而是在博物馆玻璃柜前弯下腰看到的那种——绢丝保存完好，线条依然清晰。

## 技术解读  ⏺ 稳定

```
概念描述                              →  技术解读
─────────────────────────────────────────────────────
博物馆里的古代工笔画                   →  流派：通用公式（无精确流派匹配）
绢本保存完好，无做旧                   │  锚点：museum-quality traditional
                                      │  Chinese gongbi painting on silk
                                      │
极瘦女人，素淡衣裳，微低着头           →  主体：Lin Daiyu，纤细，传统汉服
手里攥着一小把蔫了的花                │  姿态：微微低头，手持残花+花锄
脚边散落零星花瓣                      │  道具：花锄、落花、小土堆
远处一棵老树，枝条稀疏                │  环境：古树下，大量留白
                                      │
水墨灰调，花瓣淡淡粉色                 →  色彩：低饱和度，灰墨为主+淡粉
整张画留白很多                        →  构图：大量留白，中式散点透视
                                      │  材质：绢丝纹理，工笔细线
                                      │  光线：无定向光源（平面化）
                                      │  文字：葬花吟两联行书题画+红色印章
```

## Prompt 历史  📎 追加

### v1 — 2026-05-05

```
A traditional Chinese gongbi painting on well-preserved white silk, vertical scroll composition with generous negative space in the Chinese literati painting tradition.

The subject is Lin Daiyu, a young woman of extreme delicacy — frail and slender with narrow shoulders, pale translucent skin, thin willow-leaf eyebrows, and a sorrowful expression with downcast eyes. She wears simple pale-blue-white traditional hanfu made of thin silk. Her long dark hair is partially pinned up with a plain jade hairpin, loose strands falling softly against her neck.

She is captured in a quiet solitary moment: slightly bowed, holding a small handful of withered petals in one hand, a delicate wooden garden hoe resting against her side. At her feet, a small mound of earth with scattered fallen petals — pale pink, already wilting. Behind her stands an old gnarled tree with sparse branches stretching upward, a few late blossoms barely clinging on.

Color palette: muted and restrained, ink wash greys and soft blacks dominate, faint pale pink on the petals, subtle warm tones in her skin. The background is largely empty negative space, the figure and tree breathing within it — a hallmark of classical Chinese painting composition. Fine precise gongbi brushwork defines her delicate features, individual hair strands, and fabric folds with meticulous detail.

In the upper right area, traditional Chinese calligraphy in elegant semi-cursive script vertically inscribes two couplets from "葬花吟": "花谢花飞花满天，红消香断有谁怜。侬今葬花人笑痴，他年葬侬知是谁。" A small red artist seal stamp is placed below the calligraphy column.

The silk surface is clean and well-preserved with fine natural texture — museum-quality condition, displayed in gallery lighting, no aging or discoloration. Only the specified poem text appears as calligraphy, no additional random Chinese characters, no English text.
```

修改原因：初始版本

## 生成记录  📎 追加

- `gen/outputs/2026-05-05T06-24-41-257Z-lin-daiyu-burying-flowers/` — v1 首次生成 4 张
