import { ServiceItem, TechnologyItem, GalleryItem, JobVacancy } from '../types';

export const COMPANY_INFO = {
  name: 'XÍ NGHIỆP IN TÀI CHÍNH TP. HỒ CHÍ MINH',
  parentCompany: 'CÔNG TY TNHH MTV XỔ SỐ KIẾN THIẾT TP.HCM',
  slogan: 'UY TÍN – CHẤT LƯỢNG – NHANH CHÓNG',
  address: 'Lô A1 - A2 Đường A4, Cụm Công Nghiệp - Khu Đô Thị Mới Nhị Xuân, Ấp 5, Xã Xuân Thới Sơn, Hóc Môn, TP. Hồ Chí Minh',
  phone: '(028) 3595 0311 - 3595 0312',
  phoneDisplay: '(028) 3595 0311 - 3595 0312',
  fax: '(028) 3595 0818',
  email: 'itc177@hotmail.com',
  website: 'www.xskthcm.com',
  establishedYear: '1978',
  standards: ['ISO 9001:2015', 'ISO/IEC 27001:2013'],
};

export const STATISTICS = [
  { value: '45+', label: 'Năm Kinh Nghiệm', desc: 'Đồng hành cùng ngành xổ số kiến thiết và tài chính cả nước từ năm 1978.' },
  { value: '250M+', label: 'Ấn Phẩm / Năm', desc: 'Năng lực in ấn vượt trội, phục vụ hàng chục tỉnh thành miền Nam.' },
  { value: '100%', label: 'Bảo Mật An Toàn', desc: 'Bảo vệ dữ liệu, chống rò rỉ thông tin mật và chống giả tuyệt đối.' },
  { value: '200+', label: 'Nhân Sự Tay Nghề Cao', desc: 'Đội ngũ kỹ sư cơ điện từ Đức, Nhật và chuyên gia hóa học bảo mật.' },
];

export const SERVICE_ITEMS: ServiceItem[] = [
  {
    id: 'in-ve-so-kts',
    title: 'Vé số kiến thiết bằng máy in KTS hiện đại',
    shortDesc: 'Kèm mã vạch 2 chiều tích hợp số dự thưởng, bảo mật tuyệt đối.',
    longDesc: 'Giải pháp in vé số kiến thiết ứng dụng công nghệ kỹ thuật số hiện đại tiên tiến bậc nhất. Toàn bộ vé số được tích hợp hệ thống số nhảy và mã vạch 2 chiều (QR Code / DataMatrix) mã hóa chuỗi số dự thưởng biến đổi thời gian thực, đảm bảo tính minh bạch, tính xác thực cao và ngăn chặn tuyệt đối các hình thức làm giả.',
    image: '/src/assets/images/lottery_sheet_1779242696323.png',
    iconName: 'Ticket',
    bullets: [
      'In số sê-ri nhảy biến đổi bằng công nghệ laser kỹ thuật số siêu tốc, không trùng lặp',
      'Tích hợp mã vạch 2 chiều (QR Code) chứa thông tin số dự thưởng mã hóa tối mật',
      'Thiết kế họa tiết Guilloche vân chống giả đa màu sắc độc quyền của ngành xổ số',
      'Hệ thống quản lý, đóng bó, kiểm đếm và ép niêm phong bằng màng co tự động khép kín'
    ]
  },
  {
    id: 'in-ve-so-cao',
    title: 'Vé số cào trên hệ thống thiết bị hiện đại',
    shortDesc: 'Hệ thống thiết bị cào hiện đại bảo an cao chống soi chiếu tuyệt đối.',
    longDesc: 'Dây chuyền in vé số cào chuyên nghiệp được thực hiện tự động khép kín với hệ thống phủ latex nhôm hiện đại, bảo đảm độ che phủ 100%, dễ cào nhưng tuyệt đối chống soi dưới mọi loại cường độ ánh sáng hay thiết bị nội soi tầm nhiệt. Thuật toán phần mềm chuyên dụng tạo chuỗi ký tự bảo mật tối thượng.',
    image: '/src/assets/images/security_lens_1779242712535.png',
    iconName: 'Cpu',
    bullets: [
      'Lớp phủ cào latex nhôm cao cấp siêu mịn, dễ cào, chống lột và chống soi sáng',
      'Mã PIN và chuỗi sê-ri biến thiên được sinh ngẫu nhiên bảo mật 100% bằng phần mềm chuyên nghiệp',
      'Thiết kế cấu trúc in nhiều lớp phức tạp nhằm ngăn ngừa can thiệp vật lý ngoại vi',
      'Hệ thống camera AI kiểm duyệt chất lượng từng ô cào tự động và loại bỏ phế phẩm lỗi'
    ]
  },
  {
    id: 'in-chung-tu-tai-chinh',
    title: 'Chứng từ, biểu mẫu, các ấn phẩm khác của ngành tài chính',
    shortDesc: 'Chứng từ kế toán thuế, hóa đơn đỏ tự in, biểu mẫu carbonless tự nhân bản.',
    longDesc: 'Cung cấp giải pháp in ấn chuyên nghiệp cho toàn bộ hệ thống hóa đơn GTGT, hóa đơn tự in có ký hiệu bảo an, biên lai phí/lệ phí nhà nước, phiếu thu - chi kế toán và các định dạng biểu mẫu carbonless đa liên tự nhân bản sắc nét. Giấy nhập khẩu chất lượng cao đảm bảo độ bền lưu trữ lâu năm.',
    image: '/src/assets/images/invoice_docs_1779242750401.png',
    iconName: 'FileSpreadsheet',
    bullets: [
      'Sử dụng giấy Carbonless tự sao cao cấp, chữ viết đè nhạy bén và rõ chữ ở các liên dưới',
      'Quy trình in liên tục từ 2 đến 5 liên khác màu với độ đồng màu sê-ri cực kỳ chuẩn xác',
      'Đường xé răng cưa tinh xảo (micro-perforation), hỗ trợ xé rời dễ dàng không gây rách nát',
      'Kiểm soát và lưu giữ chuỗi số nhảy hóa đơn (red numbers) nghiêm ngặt đúng quy định tài chính'
    ]
  }
];

export const TECHNOLOGIES: TechnologyItem[] = [
  {
    id: 'kba-rapida',
    title: 'Hệ Thống Máy In Offset Koenig & Bauer Rapida (Đức)',
    origin: 'Đức',
    category: 'printing',
    specs: [
      'Hệ thống cấp ẩm và chỉnh chồng màu hoàn toàn tự động bằng máy tính',
      'Khổ in tối đa: 720 x 1020 mm',
      'Tốc độ in cực đại: 18,000 tờ/giờ',
      'Khả năng tích hợp cụm sấy hồng ngoại và sấy UV đồng bộ trực tiếp'
    ],
    description: 'Dây chuyền in Offset cao cấp nhất thế giới của Đức chuyên trị các đơn hàng in vé số kiến thiết với độ đồng màu tuyệt đối giữa hàng triệu bản in.'
  },
  {
    id: 'heidelberg-speedmaster',
    title: 'Máy In Heibelberg Speedmaster SM 4 Màu',
    origin: 'Đức',
    category: 'printing',
    specs: [
      'Điều khiển tập trung thông qua màn hình cảm ứng Prinect Press Center',
      'Hệ thống chồng màu chính xác tuyệt đối sai lệch dưới 0.01mm',
      'Tốc độ sản xuất ổn định: 15,000 tờ/giờ',
      'Hỗ trợ in trên các loại giấy siêu mỏng và các loại decal phức tạp'
    ],
    description: 'Thương hiệu máy in lâu đời của Đức, cho chất lượng tram in mịn màng, độ chuyển sắc trung thực, chuyên dụng cho hóa đơn cao cấp và chứng từ tài chính.'
  },
  {
    id: 'digital-inkjet-control',
    title: 'Hệ Thống Số Nhảy Biến Đổi & Mã Vạch Kodak Prosper',
    origin: 'Mỹ',
    category: 'security',
    specs: [
      'Độ phân giải bản in: 600 x 600 DPI',
      'Định dạng phông chữ số nhảy và vạch 1D, 2D biến thiên tự động',
      'Tốc độ phun mực đồng bộ băng chuyền: 300 mét/phút',
      'Hỗ trợ các loại mực bảo an phát quang hồng ngoại và huỳnh quang cực tím'
    ],
    description: 'Hệ thống đầu phun kỹ thuật số tích hợp trực tiếp lên giàn thu máy in, chuyên phục vụ in ấn số sê-ri biến thiên cho xổ số thành phố và xổ số cào bảo mật.'
  },
  {
    id: 'polar-cutting',
    title: 'Máy Xén Lập Trình Polar N 115 Plus',
    origin: 'Đức',
    category: 'finishing',
    specs: [
      'Lập trình bước xắt thông minh bằng bảng điều khiển cảm ứng',
      'Độ chính xác nhát xén đạt mức dung sai 0.01 mm',
      'Hệ thống gạt giấy tự động định vị chống chệch góc xéo',
      'Hệ thống rào hồng ngoại bảo vệ tuyệt đối an toàn vận hành'
    ],
    description: 'Đảm bảo kích thước cắt của các tập vé số và tập hóa đơn hoàn hảo 100%, không bị xơ xước, đáp ứng tiêu chuẩn nạp máy quay số tự động.'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Khu vực vận hành máy in Koenig & Bauer công suất lớn',
    category: 'machinery',
    image: '/src/assets/images/printing_hero_1779242674142.png',
  },
  {
    id: 'g2',
    title: 'Cận cảnh kiểm tra dải màu in vé số kiến thiết',
    category: 'products',
    image: '/src/assets/images/lottery_sheet_1779242696323.png',
  },
  {
    id: 'g3',
    title: 'Ứng dụng màng dính bảo mật UV Hologram cao cấp',
    category: 'certificates',
    image: '/src/assets/images/security_lens_1779242712535.png',
  },
  {
    id: 'g4',
    title: 'KCS đánh giá từng con số dập nổi',
    category: 'all',
    image: '/src/assets/images/quality_control_1779242766739.png',
  },
  {
    id: 'g5',
    title: 'Phòng gia công đóng gói, co màng nhiệt đai kiện',
    category: 'all',
    image: '/src/assets/images/post_press_1779242727987.png',
  },
  {
    id: 'g6',
    title: 'Chồng hóa đơn chứng từ carbonless đa liên sau thành phẩm',
    category: 'products',
    image: '/src/assets/images/invoice_docs_1779242750401.png',
  }
];

export const VACANCIES: JobVacancy[] = [
  {
    id: 'v1',
    title: 'Kỹ Sư Vận Hành Máy In Offset Koenig & Bauer / Heidelberg',
    department: 'Xưởng Sản Xuất In Ấn',
    type: 'Toàn thời gian (Cố định)',
    salary: '15,000,000 - 22,000,000 VNĐ / Tháng',
    deadline: '30/06/2026',
    requirements: [
      'Tốt nghiệp Trung cấp/Cao đẳng chuyên ngành Công nghệ kỹ thuật in hoặc ngành cơ khí tự động',
      'Có tối thiểu 2 năm kinh nghiệm trực tiếp đứng máy vận hành in Máy in Offset 4 màu, 5 màu',
      'Nắm bắt rõ quy trình pha mực, chồng màu và xử lý lỗi kỹ thuật bọt khí, lem mực',
      'Chăm chỉ, sẵn sàng làm ca đêm khi có dự án in vé số đợt cao điểm Tết'
    ],
    benefits: [
      'Được đóng đầy đủ BHXH, BHYT, BHTN theo luật Lao động Nhà nước',
      'Lương tháng 13 + thưởng năng suất ấn phẩm vượt chỉ tiêu cực hấp dẫn',
      'Hỗ trợ cơm trưa tại xí nghiệp và trợ cấp ca đêm',
      'Khám sức khỏe định kỳ hàng năm và du lịch nghỉ mát cùng Công ty TNHH MTV Xổ số kiến thiết TP.HCM'
    ]
  },
  {
    id: 'v2',
    title: 'Nhân Viên Kiểm Chất Lượng Ấn Phẩm (KCS) - Phòng Bảo Mật',
    department: 'Mảng Kiểm Soát KCS & Niêm Phong',
    type: 'Toàn thời gian',
    salary: '10,000,000 - 14,000,000 VNĐ / Tháng',
    deadline: '15/07/2026',
    requirements: [
      'Tốt nghiệp trung học phổ thông trở lên, ưu tiên người có am hiểu về mỹ thuật hoặc ngành in',
      'Thị lực tốt, nhạy cảm màu sắc, cẩn thận tỉ mỉ tuyệt đối trong công việc',
      'Khả năng tập trung cao độ, bảo mật chặt chẽ thông tin khách hàng và sê-ri bản in',
      'Có khả năng hoạt động nhóm và chịu áp lực thời gian giao hàng'
    ],
    benefits: [
      'Thưởng chuyên cần vàng và các kì Lễ lớn (30/4, 2/9, Tết Nguyên Đán)',
      'Phụ cấp độc hại màng cán và tiếng ồn theo chuẩn lao động Công ty Nhà Nước',
      'Cung cấp đầy đủ đồng phục bảo hộ, khẩu trang lọc carbon, kính phóng đại và sữa dinh dưỡng giữa ca',
      'Lộ trình thăng tiến lên Trưởng tổ KCS sau 2 năm đạt năng lực xuất sắc'
    ]
  }
];
