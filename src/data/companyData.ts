import { ServiceItem, TechnologyItem, GalleryItem, JobVacancy } from '../types';

export const COMPANY_INFO = {
  name: 'XÍ NGHIỆP IN TÀI CHÍNH TP. HỒ CHÍ MINH',
  parentCompany: 'CÔNG TY TNHH MTV XỔ SỐ KIẾN THIẾT TP.HCM',
  slogan: 'UY TÍN – CHẤT LƯỢNG – NHANH CHÓNG',
  address: 'Lô A1 - A2 Đường A4, Cụm Công Nghiệp - Khu Đô Thị Mới Nhị Xuân, Ấp 5, Xã Xuân Thới Sơn, Hóc Môn, TP. Hồ Chí Minh',
  phone: '(028) 3595 0311 - 3595 0312',
  phoneDisplay: '(028) 3595 0311 - 3595 0312',
  fax: '(028) 3595 0818',
  email: 'itc717@hotmail.com',
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
    id: 'komori-offset',
    title: 'Hệ Thống Máy In Offset Komori (Nhật Bản)',
    origin: 'Nhật Bản',
    category: 'printing',
    specs: [
      'Hệ thống cấp ẩm và điều khiển chồng tự động chuyên nghiệp',
      'Khổ in tối ưu, đáp ứng tiêu chuẩn tờ vé số và biểu mẫu',
      'Tốc độ in cao và ổn định liên tục cho sản lượng lớn',
      'Khả năng tích hợp sấy đồng bộ trực tiếp chống ẩm nhòe mực'
    ],
    description: 'Dây chuyền máy in Offset Komori tiên tiến từ Nhật Bản chuyên dụng cho các đơn hàng in vé số kiến thiết đạt tính chính xác màu sắc và độ sắc nét hoàn hảo trên hàng triệu bản in.'
  },
  {
    id: 'mitsubishi',
    title: 'Máy In Mitsubishi 4 Màu – 5 Màu',
    origin: 'Nhật Bản',
    category: 'printing',
    specs: [
      'Điều khiển lượng mực cân bằng và thông minh bằng máy tính',
      'Độ chồng hạt màu chính xác cao, khống chế độ lệch hạt mực',
      'Công suất vận hành lớn, bền bỉ khi in sản lượng ấn phẩm cực đại',
      'Hỗ trợ cán màng và in trên nhiều định lượng giấy đa dạng'
    ],
    description: 'Thương hiệu máy in nổi tiếng về sự bền bỉ của Nhật Bản, cho chất lượng màu in ổn định, đều màu, chuyên dụng cho hóa đơn thuế, chứng từ tài chính và đa liên liên tục.'
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
    title: 'Khu vực vận hành hệ thống máy in Komori công suất lớn',
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
    title: 'Kỹ Sư Công Nghệ In',
    department: 'Phòng Kỹ thuật & Công nghệ In',
    type: 'Toàn thời gian (Cố định)',
    salary: '15,000,000 - 25,000,000 VNĐ / Tháng',
    deadline: '30/06/2026',
    requirements: [
      'Tốt nghiệp chuyên ngành Kỹ sư Công nghệ In',
      'Có kiến thức về quy trình in offset và in kỹ thuật số',
      'Hiểu cơ bản về chế bản, quản lý màu và file in',
      'Có tinh thần trách nhiệm và khả năng làm việc nhóm',
      'Ưu tiên ứng viên có kinh nghiệm trong ngành in vé số hoặc in ấn tài chính'
    ],
    tasks: [
      'Theo dõi và hỗ trợ vận hành sản xuất in ấn',
      'Kiểm tra chất lượng file và thành phẩm in',
      'Hỗ trợ quản lý dữ liệu in biến đổi và QR Code',
      'Phối hợp giữa bộ phận chế bản và phân xưởng in'
    ],
    benefits: [
      'Được đóng đầy đủ BHXH, BHYT, BHTN theo luật Lao động Nhà nước',
      'Lương tháng 13 + thưởng năng suất ấn phẩm vượt chỉ tiêu cực hấp dẫn',
      'Hỗ trợ cơm trưa tại xí nghiệp và trợ cấp ca kíp, độc hại',
      'Khám sức khỏe định kỳ hàng năm và du lịch nghỉ mát cùng Công ty'
    ]
  },
  {
    id: 'v2',
    title: 'Họa Sĩ Thiết Kế Đồ Họa',
    department: 'Phân Xưởng Chế Bản',
    type: 'Toàn thời gian',
    salary: '12,000,000 - 18,000,000 VNĐ / Tháng',
    deadline: '15/07/2026',
    requirements: [
      'Thành thạo Adobe Illustrator, Photoshop',
      'Có kiến thức về thiết kế và chế bản ngành in',
      'Hiểu cơ bản về màu sắc, dàn trang và file xuất in',
      'Có khả năng làm việc cẩn thận, chính xác'
    ],
    tasks: [
      'Thiết kế và chỉnh sửa file in',
      'Tạo mẫu phục vụ sản xuất vé số và ấn phẩm tài chính',
      'Thực hiện công việc tại phân xưởng chế bản',
      'Chuẩn bị file in kỹ thuật số và offset',
      'Phối hợp xử lý dữ liệu biến đổi khi cần'
    ],
    benefits: [
      'Hưởng đầy đủ mọi chế độ phúc lợi, nghỉ Lễ Tết theo quy chế Công ty Nhà Nước',
      'Lương tháng 13 + thưởng hiệu quả hoàn thiện thiết kế xuất sắc',
      'Cung cấp đầy đủ thiết bị, máy tính đồ họa chuyên sâu cấu hình cao',
      'Môi trường làm việc văn minh, thân thiện, cơ hội thăng tiến rộng mở'
    ]
  }
];
