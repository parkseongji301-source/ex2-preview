/* 화면 역할과 편집 구성을 분리한 시안 데이터. 사진·기수는 기존 확인 자료를 따릅니다.
   질문 분류와 NOW 콘텐츠는 향후 원고와 이미지 확보 시 이 파일에서 확장합니다. */
window.AICA_EXPERIENCE = {
  heroScenes: [
    {label:'LEARN · 배우는 시간',title:'처음이라서,\n함께 시작합니다.',description:'낯선 코드 앞에서 만난 동료들.\n배움을 나누고, 하나씩 익혀가는 시간.'},
    {label:'BUILD · 만들어가는 과정',title:'함께 만든 생각이,\n결과물이 됩니다.',description:'교실에서 배운 것을 우리만의 아이디어로.\n함께 고민하고 구현하는 프로젝트의 시간.'},
    {label:'LIVE · 함께하는 일상',title:'같은 공간에서,\n함께 성장합니다.',description:'같은 문제를 풀고, 서로의 생각을 나누며.\n배움 사이사이 쌓이는 우리들의 이야기.'},
    {label:'NEXT · 다음을 향한 걸음',title:'지금의 경험이,\n다음으로 이어집니다.',description:'수업과 프로젝트에서 찾은 나의 관심.\n인턴십과 취업, 그다음의 가능성을 향해.'}
  ],
  nowCategories: [{id:'all',label:'전체'},{id:'project',label:'프로젝트'},{id:'live',label:'현장'},{id:'notice',label:'안내'}],
  now: [
    {id:'presentation',category:'project',label:'PROJECT · 3기',title:'배운 것이,\n하나의 결과물이 되는 순간.',description:'아이디어를 웹·앱 서비스로 구현하고 함께 나눈 최종 프로젝트 현장.',image:'assets/images/project-team.jpg',alt:'3기 교육생의 핵심융합 프로젝트 발표 현장',caption:'3기 핵심융합 프로젝트 성과물 발표 및 전시회 · 2022',detail:'아이디어를 웹·앱 서비스로 구현하고, 발표와 심사로 공유한 핵심융합 프로젝트의 현장입니다.',source:'핵심융합 프로젝트 성과물 발표 및 전시회',date:'2022.11.13'},
    {id:'festival',category:'live',label:'LIVE · 3기',title:'같은 문제 앞에,\n함께 모인 사람들.',description:'노트북을 펼치고 함께 참여한 코딩 페스티벌의 하루.',image:'assets/images/festival.jpg',alt:'함께 문제를 푸는 3기 코딩 페스티벌 참여 교육생들',caption:'3기 Coding Festival 현장 · 2022',detail:'노트북을 펼쳐 놓고 다 같이 참여한 3기 코딩 페스티벌의 한 장면입니다. 같은 교실에서 함께 문제를 푸는 교육생들의 모습을 담았습니다.',source:'인공지능사관학교 Coding Festival 현장 스케치 (1)',date:'2022.08.09'},
    {id:'siren',category:'project',label:'RESULT · 5기',title:'CCTV 속 움직임에서\n보행자의 낙상을 찾아내다.',description:'SIREN 팀 · 컴퓨터 비전 프로젝트',detail:'5기 성과발표회 기록에서 확인한 보행자 낙상 감지 모델입니다. 팀의 실제 결과물 이미지와 제작 과정은 자료 확보 후 추가할 예정입니다.',source:'5기 성과발표회 기록',note:'결과물 이미지 준비 중'},
    {id:'hsh',category:'project',label:'RESULT · 5기',title:'복약과 건강 관리를 돕는\n케어 챗봇, 알타리.',description:'HSH Crew · 대화형 AI 프로젝트',detail:'5기 성과발표회에 소개된 케어 챗봇 프로젝트입니다. 서비스 화면과 팀의 구체적인 제작 과정은 자료 확보 후 추가할 예정입니다.',source:'5기 성과발표회 기록',note:'결과물 이미지 준비 중'},
    {id:'archive-guide',category:'notice',label:'NOTICE',title:'입교 전 궁금한 것들을\n교육생의 이야기로 만나보세요.',description:'수업과 팀 활동, 생활에 관한 공개 기록을 질문별로 모았습니다.',href:'story.html#questions'}
  ],
  questions: [
    {id:'all',label:'전체'},{id:'class',label:'수업은 어려울까?'},{id:'beginner',label:'비전공자도 괜찮을까?'},{id:'team',label:'팀 활동은 실제로 어떨까?'},{id:'day',label:'하루는 어떻게 보낼까?'},{id:'gwangju',label:'광주 생활은 어떨까?'},{id:'support',label:'어떤 지원을 받을까?'},{id:'project',label:'프로젝트는 무엇을 만들까?'},{id:'career',label:'취업까지 어떻게 이어질까?'}
  ],
  stories: [
    {id:'live-22',questions:['beginner','class','team','project'],person:'손민초',title:'낯선 코드 앞에서, 동료를 만났습니다.',summary:'경제학 전공에서 개발로. 질문하는 교실과 첫 팀 프로젝트에서 찾은 나의 역할.'},
    {id:'rev-289',questions:['class','day','gwangju','support'],person:'나범수',title:'수업이 끝난 뒤에도 복습이 필요했던 이유',summary:'학습량과 기초 공부, 그리고 숙소비 지원이 생활에 도움이 되었다는 개인의 후기.',extra:'이 후기에는 숙소비 지원으로 생활의 부담이 줄었다는 경험도 담겨 있습니다. 개인이 당시 경험한 내용이며, 현재의 지원 조건을 안내하는 것은 아닙니다.'},
    {id:'rev-308',questions:['team','project'],person:'이채원',title:'처음 만난 사람들과, 하나의 프로젝트를 만든다는 것',summary:'기초 학습에서 팀 프로젝트로. 배운 코딩을 실제로 적용해 본 경험.'},
    {id:'rev-309',questions:['class','career','project'],person:'임정윤',title:'웹에서 데이터로, 관심이 넓어진 시간',summary:'웹 기반 JS 트랙에서 데이터 분석과 백엔드로 관심을 넓혀간 수료생의 기록.'},
    {id:'rev-278',questions:['beginner','class','support'],person:'윤초록',title:'입교 전의 나에게 알려주고 싶은 공부',summary:'비전공자로서 느낀 수업의 어려움과 사전 공부의 중요성.'},
    {id:'rev-310',questions:['class'],person:'곽*규',title:'모르는 것을 물어볼 수 있는 수업',summary:'프리트레이닝부터 수업 중 질문까지. 한 교육생에게 기억에 남은 배움의 환경.'}
  ]
};
