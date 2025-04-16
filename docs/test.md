<update />

# 测试内容

<Linkcard url="https://github.com/Barbatos411/Ethereal-Sounds" title="Ethereal Sounds" description="一个模仿Listen1的在线、可拓展的音乐播放器✨" logo="/logo.jpg"/>

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::


::: code-group

```sh [pnpm]
#查询pnpm版本
pnpm -v
```

```sh [yarn]
#查询yarn版本
yarn -v
```

:::



<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/Barbatos411.png',
    name: 'Barbatos',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/Barbatos411' }
    ]
  }
]
</script>

# 关于我们

向我们出色的团队问好。

<VPTeamMembers size="small" :members />