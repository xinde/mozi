# 墨字 Mozi

一款面向移动端的汉字学习 PWA，适合家长陪伴孩子识字、查字和阅读注音短文。

- 在线应用：https://xinde.github.io/mozi/
- 源码仓库：https://github.com/xinde/mozi

## 功能

- 查询汉字拼音、部首、笔画、结构、传统字形和释义
- 田字格字形、可调速笔顺动画和米字格逐笔顺序
- 当前新增笔画使用朱砂红标识
- 多音字按读音切换对应释义
- 输入或粘贴短文，自动标注拼音
- 注音阅读支持大、中、小三级正文字号
- 点按文章或释义中的汉字，查看生字卡和快速笔顺
- 支持安装到手机桌面和离线使用

## 技术栈

- React
- TypeScript
- Vite
- pinyin-pro
- Hanzi Writer
- vite-plugin-pwa

视觉与组件规范见 [DESIGN.md](./DESIGN.md)。

## 数据来源与致谢

### chinese-xinhua

本项目最初的汉字释义、部首、笔画和成语数据整理工作，参考并使用了
[pwxcoo/chinese-xinhua](https://github.com/pwxcoo/chinese-xinhua)。该仓库收录汉字、词语、成语和歇后语数据，并公开了相关整理脚本，为本项目的早期字典功能提供了重要基础。

原仓库地址：

https://github.com/pwxcoo/chinese-xinhua.git

本项目会根据移动端离线使用需求，对原始数据进行裁剪、索引、结构补充和格式转换。原始数据的准确性、版权说明及使用限制请同时参考上游仓库文档。

### 其他开源项目

- [pinyin-pro](https://github.com/zh-lx/pinyin-pro)：汉字和文章拼音转换、多音字与语境注音
- [Hanzi Writer](https://github.com/chanind/hanzi-writer)：汉字笔顺数据渲染与动画
- [cnchar](https://github.com/theajack/cnchar)：偏旁部首和汉字结构信息参考

## 本地开发

```bash
npm install
npm run dev
```

## 数据生成

生成通用多音字读音义项索引：

```bash
npm run generate:data
```

生成结果位于 `public/data/polyphonic.json`。

## 质量检查与生产构建

```bash
npm run lint
npm run build
npm run preview
```

## PWA 与离线数据

生产构建会预缓存应用外壳、紧凑汉字字典、成语索引和多音字义项索引。Hanzi Writer 笔顺数据在首次访问对应汉字时加载，并由 Service Worker 缓存。

## 许可证与数据声明

应用源码采用 MIT License。第三方库和数据仍遵循各自的许可证与版权说明。

字典数据来自公开资料和开源项目的整理结果，不应被视为权威语言规范。涉及教学、出版或商业用途时，建议进一步参照《通用规范汉字表》及权威辞书核对。
