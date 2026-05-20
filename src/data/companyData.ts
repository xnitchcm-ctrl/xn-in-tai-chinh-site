import { ServiceItem, TechnologyItem, GalleryItem, JobVacancy } from '../types';

export const COMPANY_INFO = {
  name: 'XÍ NGHIỆP IN TÀI CHÍNH',
  parentCompany: 'CÔNG TY TNHH MTV XỔ SỐ KIẾN THIẾT TP.HCM',
  slogan: 'CHUYÊN NGHIỆP – CHÍNH XÁC – BẢO MẬT',
  address: 'Lô A1-A2 Đường A, Cụm Công Nghiệp - Khu dân cư Nhị Xuân, Ấp 25, Xã Xuân Thới Sơn, TP Hồ Chí Minh',
  phone: '028 3595 0311',
  phoneDisplay: '028 3595 0311', // Hotline format
  email: 'xnitchcm@gmail.com',
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
    id: 'in-ve-so',
    title: 'IN VÉ SỐ TRUYỀN THỐNG & TỰ CHỌN',
    shortDesc: 'Công nghệ hiện đại, màu sắc sắc nét, chống giả hiệu quả.',
    longDesc: 'Dịch vụ in vé số kiến thiết truyền thống, vé số tự chọn, vé cào biết đổi số sê-ri tự động có độ tin cậy tuyệt đối. 100% sản phẩm được in trên giấy chống giả cao cấp có vân chìm chéo độc quyền của Xổ Số TP.HCM.',
    image: '/src/assets/images/lottery_sheet_1779242696323.png',
    iconName: 'Ticket',
    bullets: [
      'In số sê-ri nhảy biến đổi bằng công nghệ laser tốc độ cao',
      'Ứng dụng mực in nhạy nhiệt (biến mất hoặc đổi màu dưới xúc tác nhiệt)',
      'Thiết kế họa tiết hoa văn phức tạp độc quyền khó dựng lại bằng máy scan',
      'Hệ thống kiểm đếm và ép đóng bó tự động niêm phong',
    ]
  },
  {
    id: 'in-chung-tu',
    title: 'IN CHỨNG TỪ TÀI CHÍNH & HÓA ĐƠN',
    shortDesc: 'Chứng từ tài chính, hóa đơn thuế, độ tin cậy tuyệt đối.',
    longDesc: 'Xí nghiệp in chuyên cung cấp giải pháp in ấn các loại biểu mẫu carbonless tự nhân bản, hóa đơn VAT kế toán, phiếu thu chi, biên nhận ngân hàng chất lượng cao, giữ màu liên tục dài lâu.',
    image: '/src/assets/images/invoice_docs_1779242750401.png',
    iconName: 'FileSpreadsheet',
    bullets: [
      'Giấy carbonless nhập khẩu cao cấp cho trải nghiệm viết nhạy bén',
      'In liên tục từ 2 đến 5 liên khác màu chuẩn xác nét chữ',
      'Răng cưa gờ xé micro-perforation bén ngắt, rạch ròi',
      'Kiểm soát mã vạch và số nhảy liên tục không trùng lặp lỗi'
    ]
  },
  {
    id: 'in-bao-mat',
    title: 'IN ẤN BẢO MẬT CHẤT LƯỢNG CAO',
    shortDesc: 'Giải pháp in bảo mật đáp ứng tiêu chuẩn nhà nước khắt khe.',
    longDesc: 'Sử dụng các công nghệ bảo an tiền tệ và chứng chỉ cao cấp của Ngân hàng nhà nước Việt Nam, bao gồm in mực phản quang vô hình, dập nóng màng Hologram óng ánh, ký hiệu siêu nhỏ chỉ đọc được dưới kính lúp chuyên dụng.',
    image: '/src/assets/images/security_lens_1779242712535.png',
    iconName: 'ShieldAlert',
    bullets: [
      'Họa tiết nền bảo an Guilloche cong tròn toán học siêu nét',
      'Mực phát quang dưới đèn UV bước sóng hồng cực ngắn',
      'Tem Hologram 3D chống giả dán chặt bằng nhiệt cơ học',
      'Ký tự hiển vi độ phân giải cực cao khó photocopy'
    ]
  },
  {
    id: 'gia-cong-sau-in',
    title: 'GIA CÔNG THÀNH PHẨM SAU IN',
    shortDesc: 'Cắt, đóng số, đóng tập, co màng bảo vệ tự động hoàn toàn.',
    longDesc: 'Chúng tôi sở hữu dây chuyền khép kín tự động hóa sau in. Bao gồm hệ thống xén lập trình máy tính kỹ thuật số, đóng bìa ghim cơ khí lực lớn, gấp và dán thùng carton hoàn thiện, đai bảo vệ kiên cố chống ẩm mốc.',
    image: '/src/assets/images/post_press_1779242727987.png',
    iconName: 'Cpu',
    bullets: [
      'Sử dụng máy cắt CNC tốc độ cao thương hiệu Polar của Đức',
      'Đóng tập đục lỗ gấp nếp góc cơ khí năng suất 200,000 cuốn/ngày',
      'Hút chân không, đóng màng co nhiệt giúp sản phẩm luôn sáng mới',
      'Dán mác QR code quản lý lô hàng và bảo mật vị trí vận chuyển'
    ]
  },
  {
    id: 'kiem-soat-kcs',
    title: 'KIỂM SOÁT CHẤT LƯỢNG (KCS)',
    shortDesc: 'Quy trình kiểm soát chặt chẽ từng con số, đảm bảo sản phẩm đạt chuẩn.',
    longDesc: 'Áp dụng bộ tiêu chuẩn quản lý chất lượng quốc tế ISO 9001:2015 khắt khe nhất. Mỗi tờ in vé số và chứng từ đều trải qua quy trình kiểm soát KCS 3 tầng: quét sensor quang học tự động, kiểm tra ngoại quan thủ công, và nghiệm thu chất lượng bàn giao.',
    image: '/src/assets/images/quality_control_1779242766739.png',
    iconName: 'CheckSquare',
    bullets: [
      'Trực tiếp giám sát tỷ lệ lệch màu dE dưới 1.0 bằng quang phổ kế',
      'Hủy thủ tiêu toàn bộ phế phẩm lỗi in bảo mật theo biên bản hội đồng',
      'Hệ thống camera AI phát hiện đứt nét sê-ri ở vận tốc 500m/phút',
      'Lưu mẫu đối chứng nghiêm ngặt trong hệ thống kho bảo an cứu hộ'
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
