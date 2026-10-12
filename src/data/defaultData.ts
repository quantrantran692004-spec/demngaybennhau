import { AppStateData, SongTrack } from '../types';

export const bundledPlaylist: SongTrack[] = [
  {
    id: "bundled-track-01",
    title: "Vợ Tuyệt Vời Nhất",
    artist: "Vũ Duy Khánh",
    duration: "MP3",
    audioUrl: "/music/track-01.mp3"
  },
  {
    id: "bundled-track-02",
    title: "Chỉ Bằng Cái Gật Đầu",
    artist: "Yan Nguyễn x Zeaplee",
    duration: "MP3",
    audioUrl: "/music/track-02.mp3"
  },
  {
    id: "bundled-track-03",
    title: "Tìm Em",
    artist: "Hngle ft. Bảo Anh",
    duration: "MP3",
    audioUrl: "/music/track-03.mp3"
  },
  {
    id: "bundled-track-04",
    title: "Hơn Cả Yêu",
    artist: "Đức Phúc",
    duration: "MP3",
    audioUrl: "/music/track-04.mp3"
  },
  {
    id: "bundled-track-05",
    title: "Làm Vợ Anh Nhé",
    artist: "Chi Dân",
    duration: "MP3",
    audioUrl: "/music/track-05.mp3"
  },
  {
    id: "bundled-track-06",
    title: "Món Quà Vô Giá",
    artist: "Tim",
    duration: "MP3",
    audioUrl: "/music/track-06.mp3"
  },
  {
    id: "bundled-track-07",
    title: "Nếu Biết Đó Là Lần Cuối",
    artist: "Đức Trường",
    duration: "MP3",
    audioUrl: "/music/track-07.mp3"
  },
  {
    id: "bundled-track-08",
    title: "Mãi Mãi Bên Nhau",
    artist: "Noo Phước Thịnh",
    duration: "MP3",
    audioUrl: "/music/track-08.mp3"
  },
  {
    id: "bundled-track-09",
    title: "Bông Hoa Đẹp Nhất",
    artist: "Quân A.P",
    duration: "MP3",
    audioUrl: "/music/track-09.mp3"
  },
  {
    id: "bundled-track-10",
    title: "Beautiful In White",
    artist: "Shane Filan",
    duration: "MP3",
    audioUrl: "/music/track-10.mp3"
  },
  {
    id: "bundled-track-11",
    title: "Until I Found You",
    artist: "Stephen Sanchez, Em Beihold",
    duration: "MP3",
    audioUrl: "/music/track-11.mp3"
  },
  {
    id: "bundled-track-12",
    title: "Thương Em Đến Già",
    artist: "Lê Bảo Bình",
    duration: "MP3",
    audioUrl: "/music/track-12.mp3"
  },
  {
    id: "bundled-track-13",
    title: "Vết Thương",
    artist: "Fishy",
    duration: "MP3",
    audioUrl: "/music/track-13.mp3"
  },
  {
    id: "bundled-track-14",
    title: "Yêu Em Hơn Mỗi Ngày",
    artist: "Andiez",
    duration: "MP3",
    audioUrl: "/music/track-14.mp3"
  }
];

export const initialData: AppStateData = {
  profile: {
    herName: "huongmuoi",
    myNickname: "Người luôn cạnh em",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    musicCoverUrl: "/couple-background.jfif",
    anniversaryDate: "2023-12-17",
    siteTitle: "HER PRIVATE WORLD",
    welcomeSub: "Nơi lưu dấu những dịu dàng không cần vội vã",
    heroQuote: "Mỗi khi em mệt mỏi với thế giới ngoài kia, hãy nhớ rằng ở đây luôn có một góc trời nhỏ bình yên dành riêng cho em.",
  },
  activeTheme: "morning",
  currentMood: null,
  letters: [
    {
      id: "letter-1",
      title: "Gửi em, vào một ngày bình thường nhưng đáng nhớ",
      category: "love",
      author: "Anh",
      dateSent: "2024-06-15",
      snippet: "Có những điều anh không khéo nói bằng lời, nên anh gửi vào từng dòng chữ này...",
      content: `Gửi huongmuoi,\n\nCó những buổi chiều khi tan ca, nhìn dòng người vội vã trên phố, anh chỉ nghĩ về việc em đã ăn tối chưa, ngày hôm nay của em có bị ai làm phiền lòng hay không.\n\nAnh không hứa hẹn những điều vĩ mô xa vời. Anh chỉ mong mỗi ngày có thể lắng nghe em kể về những điều nhỏ nhặt nhất: một chú mèo hoang em tình cờ thấy trên đường, cốc trà sữa vừa ngọt, hay một bản nhạc khiến em thấy nhẹ lòng.\n\nCảm ơn em vì đã hiện diện trong cuộc sống của anh một cách tự nhiên và dịu dàng như thế.`,
      isRead: true,
      waxColor: "#9E5B6A"
    },
    {
      id: "letter-2",
      title: "Khi em cảm thấy cả thế giới đang đòi hỏi quá nhiều",
      category: "comfort",
      author: "Anh",
      dateSent: "2024-08-01",
      snippet: "Em không cần phải lúc nào cũng mạnh mẽ và chu toàn tất cả mọi việc...",
      content: `huongmuoi à,\n\nNếu hôm nay có điều gì khiến em kiệt sức, em cứ cho phép mình được mệt mỏi, được thở dài, và thậm chí là chẳng cần làm gì cả trong vài giờ tới.\n\nEm không có nghĩa vụ phải làm hài lòng tất cả mọi người. Giá trị của em không nằm ở việc em làm việc nhiều đến đâu, mà nằm ở chính tâm hồn lương thiện và đáng trân trọng của em.\n\nUống một ngụm nước ấm, đắp chăn thật êm nhé. Ngày mai sẽ là một ngày khác, và anh luôn ở đây.`,
      isRead: false,
      waxColor: "#5A6B63"
    },
    {
      id: "letter-3",
      title: "Mở vào ngày sinh nhật của em",
      category: "birthday",
      author: "Anh",
      dateSent: "2024-11-10",
      unlockDate: "2026-11-10", // Ví dụ ngày sinh nhật tương lai để kiểm tra tính năng khóa
      snippet: "Lá thư này được niêm phong cho đến ngày đặc biệt nhất trong năm...",
      content: `Chúc mừng sinh nhật cô gái tuyệt vời nhất!\n\nTuổi mới, anh chúc em nụ cười luôn rạng rỡ trên môi, những lo âu tan biến sau tách trà sớm, và mọi ước nguyện ấp ủ trong lòng em đều sẽ từng bước trở thành hiện thực.\n\nCảm ơn ngày em sinh ra đời, để hôm nay anh có được diễm phúc đồng hành cùng em.`,
      isRead: false,
      waxColor: "#D4AF37"
    }
  ],
  memories: [
    {
      id: "mem-1",
      title: "Buổi chiều đầu tiên ngồi bên hiên quán nhỏ",
      date: "2024-05-20",
      location: "Góc cà phê quen",
      imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80",
      content: "Trời hôm ấy có một cơn mưa rào bất chợt. Hai đứa ngồi dưới mái hiên nghe tiếng mưa rơi trên mái tôn, nói những câu chuyện không đầu không cuối. Lúc ấy anh nhận ra, bình yên đôi khi chỉ giản đơn như vậy.",
      category: "milestone",
      isFavorite: true,
      moodTag: "Ấm áp"
    },
    {
      id: "mem-2",
      title: "Chuyến đi ngắm hoàng hôn buông trên đồi cỏ",
      date: "2024-09-02",
      location: "Đà Lạt",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      content: "Gió se se lạnh, ráng chiều màu cam mật ong nhuộm lên tóc em. Em cười nói đùa rằng nếu có thể gói hoàng hôn này mang về nhà thì tốt biết mấy.",
      category: "trip",
      isFavorite: true,
      moodTag: "Mơ màng"
    },
    {
      id: "mem-3",
      title: "Bữa tối tự nấu sau một tuần bận rộn",
      date: "2024-10-18",
      location: "Gian bếp nhỏ",
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
      content: "Dù món canh có hơi mặn một chút và em đã lỡ tay làm cháy mép bánh mì, nhưng đó lại là bữa tối ngon và nhiều tiếng cười nhất từ trước tới nay.",
      category: "cozy",
      isFavorite: false,
      moodTag: "Vui vẻ"
    }
  ],
  wishes: [
    {
      id: "wish-1",
      text: "Cùng nhau đón một sớm bình minh bên bờ biển vắng",
      category: "travel",
      completed: true,
      completedDate: "2024-07-15",
      notes: "Đã thực hiện tại bãi biển Nha Trang lúc 5h sáng, biển xanh ngắt và trong lành."
    },
    {
      id: "wish-2",
      text: "Đi học một lớp làm gốm và nặn tặng nhau hai chiếc cốc kỷ niệm",
      category: "experience",
      completed: false,
      notes: "Sẽ chọn một xưởng gốm mộc mạc vào một ngày cuối tuần rảnh rỗi."
    },
    {
      id: "wish-3",
      text: "Cùng nhau nấu một bữa ăn thịnh soạn theo công thức mới",
      category: "food",
      completed: true,
      completedDate: "2024-09-20",
      notes: "Món mì Ý sốt nấm thơm lừng."
    },
    {
      id: "wish-4",
      text: "Cùng đọc hết một cuốn sách hay bên tách trà ấm",
      category: "heart",
      completed: false,
      notes: "Mỗi tối trước khi ngủ cùng đọc một chương."
    },
    {
      id: "wish-5",
      text: "Chuyến du lịch mùa thu ngắm lá vàng rơi",
      category: "travel",
      completed: false,
      targetDate: "2025-10-01",
      notes: "Dạo bước trên những con đường ngập lá phong vàng."
    }
  ],
  photos: [
    {
      id: "photo-1",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      caption: "Nụ cười rạng rỡ của em dưới ánh nắng sớm",
      date: "2024-06-10",
      location: "Vườn hoa hồng"
    },
    {
      id: "photo-2",
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      caption: "Khoảnh khắc trầm ngâm đọc sách bên khung cửa sổ",
      date: "2024-08-14",
      location: "Góc ban công"
    },
    {
      id: "photo-3",
      url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      caption: "Ánh mắt biết cười khi đón nhận một điều bất ngờ",
      date: "2024-10-05",
      location: "Phố sách"
    },
    {
      id: "photo-4",
      url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
      caption: "Tà áo trắng bay nhẹ trong làn gió mùa thu",
      date: "2024-11-20",
      location: "Bờ hồ tĩnh lặng"
    }
  ],
  dailyNotes: [
    {
      id: "note-1",
      quote: "Em không cần phải rực rỡ như ánh mặt trời, chỉ cần êm đềm như một vạt trăng đêm, tự soi tỏ con đường của chính mình.",
      author: "Gửi em",
      tag: "Vỗ về"
    },
    {
      id: "note-2",
      quote: "Hôm nay nếu có mệt, hãy tự thưởng cho mình một ly trà ấm, mở một bản nhạc dịu dàng và buông lơi mọi nghĩ suy.",
      author: "Gửi em",
      tag: "Thư giãn"
    },
    {
      id: "note-3",
      quote: "Thế giới này luôn chuyển động không ngừng, nhưng trong mắt anh, khoảnh khắc em mỉm cười là lúc thời gian ngừng lại.",
      author: "Gửi em",
      tag: "Yêu thương"
    },
    {
      id: "note-4",
      quote: "Mong em luôn có đủ dũng khí để theo đuổi những gì mình yêu thích, và đủ kiên định để buông bỏ những muộn phiền không đáng có.",
      author: "Gửi em",
      tag: "Động lực"
    },
    {
      id: "note-5",
      quote: "Đừng quên ăn uống đúng giờ nhé. Sức khỏe và niềm vui của em là điều quý giá nhất.",
      author: "Gửi em",
      tag: "Quan tâm"
    }
  ],
  surpriseUnlocked: false,
  playlist: bundledPlaylist
};

export const sampleGameCards = [
  {
    id: "card-1",
    type: "compliment" as const,
    title: "Lời khen bí mật",
    description: "Em có biết đôi mắt của em khi cười với người khác ấm áp đến nhường nào không? Đó là điều đẹp nhất mà anh từng thấy."
  },
  {
    id: "card-2",
    type: "invitation" as const,
    title: "Tấm vé hẹn hò đặc cách",
    description: "Em có quyền chọn bất kỳ một quán ăn hoặc một địa điểm nào em muốn đến vào cuối tuần này. Mọi thứ anh sẽ chuẩn bị chu đáo!"
  },
  {
    id: "card-3",
    type: "challenge" as const,
    title: "Thử thách ngọt ngào",
    description: "Nhắm mắt lại trong 30 giây, hít sâu ba nhịp thở chậm, và nghĩ về điều khiến em bật cười gần đây nhất."
  },
  {
    id: "card-4",
    type: "deep_question" as const,
    title: "Câu hỏi lắng nghe",
    description: "Nếu có một điều em đang băn khoăn nhưng chưa nói với ai, tối nay hãy kể cho anh nghe nhé?"
  },
  {
    id: "card-5",
    type: "invitation" as const,
    title: "Phiếu mát-xa & gội đầu thư giãn",
    description: "Được áp dụng bất kỳ lúc nào em thấy mỏi vai hay căng thẳng sau một ngày dài làm việc!"
  }
];

export const sampleQuizQuestions = [
  {
    id: 1,
    question: "Nếu có một ngày chủ nhật hoàn toàn rảnh rỗi không vướng bận, em sẽ chọn làm gì?",
    options: [
      { label: "A", text: "Cuộn mình trong chăn đọc sách, nghe mưa rơi", points: "cozy", hint: "Một tâm hồn tìm kiếm sự yên ả sâu lắng" },
      { label: "B", text: "Đi cà phê góc phố xinh xắn, chụp vài tấm ảnh kỷ niệm", points: "aesthetic", hint: "Nét đẹp tinh tế của người yêu thẩm mỹ" },
      { label: "C", text: "Lên xe đi dã ngoại về nơi có cây xanh và gió lộng", points: "nature", hint: "Trái tim phóng khoáng hướng về thiên nhiên" },
      { label: "D", text: "Cùng người thương nấu một bữa thật ngon tại nhà", points: "love", hint: "Sự ấm áp đong đầy từ gian bếp nhỏ" }
    ]
  },
  {
    id: 2,
    question: "Món quà tinh thần nào khiến em thấy được xoa dịu nhất sau ngày dài?",
    options: [
      { label: "A", text: "Một cái ôm thật chặt không cần nói lời nào", points: "hug", hint: "Ngôn ngữ của sự an toàn tuyệt đối" },
      { label: "B", text: "Một ly trà sữa/nước ép đúng vị em thích mang tới tận tay", points: "sweet", hint: "Sự săn sóc tỉ mỉ từ điều bé nhỏ" },
      { label: "C", text: "Một người ngồi kiên nhẫn nghe em xả hết mọi ấm ức", points: "listen", hint: "Món quà của sự thấu hiểu chân thành" },
      { label: "D", text: "Một không gian hoàn toàn yên tĩnh để thả lỏng một mình", points: "space", hint: "Khoảng lặng để nạp lại năng lượng tự thân" }
    ]
  },
  {
    id: 3,
    question: "Nếu tình cảm của chúng ta là một giai điệu, em nghĩ nó giống điều gì nhất?",
    options: [
      { label: "A", text: "Bản ballad piano chậm rãi, da diết", points: "piano", hint: "Chiều sâu và sự bền bỉ của thời gian" },
      { label: "B", text: "Giai điệu acoustic mộc mạc bên đống lửa ấm", points: "acoustic", hint: "Sự chân thật, không tô vẽ cầu kỳ" },
      { label: "C", text: "Bản lofi êm ái xua tan mệt mỏi mỗi đêm", points: "lofi", hint: "Chốn bình yên xoa dịu mọi giông bão" },
      { label: "D", text: "Khúc jazz vui tươi rộn rã bước chân dạo phố", points: "jazz", hint: "Niềm vui lấp lánh trong từng ánh nhìn" }
    ]
  }
];
