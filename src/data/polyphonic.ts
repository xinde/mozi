export interface CuratedPronunciation {
  reading: string
  summary: string
  meanings: string[]
  examples: string[]
}

export const curatedPolyphonic: Record<string, CuratedPronunciation[]> = {
  行: [
    { reading: 'xíng', summary: '走、做、可以', meanings: ['走动或出行。', '做、办理或实施。', '表示可以、能干。'], examples: ['行走', '旅行', '执行', '这样也行'] },
    { reading: 'háng', summary: '行列、行业、机构', meanings: ['横向排列的一排。', '职业或行业。', '某些营业机构。'], examples: ['一行字', '同行', '银行'] },
    { reading: 'hàng', summary: '刚强的样子', meanings: ['古汉语读音，表示刚强。常见于“行行”。'], examples: ['行行'] },
    { reading: 'héng', summary: '道行中的读音', meanings: ['用于“道行”，指僧道修行的功夫，也泛指本领。'], examples: ['道行'] },
  ],
  长: [
    { reading: 'cháng', summary: '长度大、时间久', meanings: ['两点之间距离大。', '时间久。'], examples: ['长江', '长久'] },
    { reading: 'zhǎng', summary: '生长、年长、主管', meanings: ['生长或成长。', '年纪较大。', '负责人。'], examples: ['长大', '兄长', '校长'] },
  ],
  重: [
    { reading: 'zhòng', summary: '分量大、重要', meanings: ['重量或程度大。', '重要、重视。'], examples: ['重量', '重要', '尊重'] },
    { reading: 'chóng', summary: '重复、再一次', meanings: ['重复或重叠。', '再次、重新。'], examples: ['重复', '重来'] },
  ],
  乐: [
    { reading: 'lè', summary: '快乐、乐于', meanings: ['快乐、欢喜。', '喜欢或乐于做某事。'], examples: ['快乐', '乐于助人'] },
    { reading: 'yuè', summary: '音乐', meanings: ['有组织的声音艺术。'], examples: ['音乐', '乐器'] },
  ],
}
