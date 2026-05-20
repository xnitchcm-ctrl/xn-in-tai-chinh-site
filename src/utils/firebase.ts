import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase with safety fallback wrapping
let app;
let db: any;
let auth: any;
let isFirebaseAvailable = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  auth = getAuth(app);
  isFirebaseAvailable = true;
  console.log('Firebase initialized successfully connection status.');
} catch (error) {
  console.error('Firebase initialization error. App will run in Offline LocalStorage mode.', error);
}

export { db, auth, isFirebaseAvailable };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

// Global exception reporting for strict AI integration diagnostic tracking
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
    },
    operationType,
    path
  };
  console.error('Firestore Security / Operations Error Incident: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Definition of corporate categories
export const NEWS_CATEGORIES = [
  "Hoạt động sản xuất",
  "Hoạt động đoàn thể",
  "Thi đua - Khen thưởng",
  "Công nghệ in mới",
  "Thông báo doanh nghiệp",
  "Văn hoá doanh nghiệp"
];

// Rich news schema representation
export interface NewsPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  isPinned: boolean;
  createdAt: string; // ISO String
  author: string;
}

// Pre-populated default dataset
export const DEFAULT_MOCK_NEWS: NewsPost[] = [
  {
    id: "tin-1-offset",
    title: "Vận hành hệ thống máy in Offset công nghiệp thế hệ mới",
    subtitle: "Nâng cao 45% công suất sản xuất biểu mẫu và chứng từ tài chính bảo mật tối cao.",
    content: "Xí nghiệp In chính thức đưa vào vận hành dòng máy in Offset đa màu sắc dải nạp tự động liên tục mới. Hệ thống được tích hợp cánh tay robot tự tinh chỉnh mật độ quang phổ màng nước, triệt tiêu hoàn toàn hiện tượng nhòe mực sê-ri hay lệch vách cắt. Đây là bước đột phá kỹ thuật đáp ứng đợt hàng lập biểu mẫu tài chính cuối năm 2026.",
    category: "Công nghệ in mới",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    isPinned: true,
    createdAt: "2026-05-18T08:00:00Z",
    author: "Phòng Kỹ thuật & Công nghệ"
  },
  {
    id: "tin-2-kiem-dinh",
    title: "Ứng dụng máy quét quang học kiểm định chất lượng vé số tự động",
    subtitle: "Rà soát sê-ri kĩ thuật số tỉ lệ chuẩn xác 100% trước khi niêm phong màng co.",
    content: "Hệ thống KCS khép kín mới sử dụng công nghệ quét AI nhận dạng ký tự quang học (OCR) tốc độ 800 sản phẩm/phút. Máy quét có trách nhiệm rà soát từng đầu số nhảy, mã vạch 2 chiều dự thưởng để đối chiếu chéo với DB hệ thống. Bất kì tờ vé số nào có hiện tượng nhạt sọc mực hay sệ vạch sê-ri đều bị loại và hủy cơ khí tự động lập biên bản báo cáo hội đồng giám sát quốc phòng.",
    category: "Hoạt động sản xuất",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    isPinned: true,
    createdAt: "2026-05-15T09:30:00Z",
    author: "Khối Quản lý Chất lượng KCS"
  },
  {
    id: "tin-3-dao-tao",
    title: "Khóa đào tạo chuyên sâu nghiệp vụ kỹ thuật in bảo mật và chất bảo an",
    subtitle: "Bồi dưỡng tay nghề kĩ sư nạp mực cảm biến nhiệt và dập nóng tem Hologram 3D định vị.",
    content: "Dưới sự hướng dẫn của chuyên gia Đức, toàn bộ tổ sản xuất dây chuyền đặc thù đã hoàn thành khóa thực hành chất bảo an bảo mật nâng cao. Khóa học đào tạo kĩ thuật in dập màng nóng đổi màu chiết quang nghệ thuật, dệt phai vân chéo ẩn chìm trên giấy niêm phong chỉ ngọc lân phản quang vô tuyến, giúp đối tác chống tuyệt đối nạn làm giả vé bảo mật quốc gia.",
    category: "Văn hoá doanh nghiệp",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    createdAt: "2026-05-12T14:15:00Z",
    author: "Phòng Nhân sự & Đào tạo"
  },
  {
    id: "tin-4-cong-doan",
    title: "Đại hội đoàn thể và hoạt động thi đua Công đoàn cơ sở xuất sắc",
    subtitle: "Phát động phong trào 'Sản xuất giỏi - KCS nghiêm - Về đích sớm'.",
    content: "Ban Chấp hành Công đoàn Xí nghiệp đã tổ chức tổng kết thi đua sản xuất an toàn quý 1/2026. Nhiều tập thể tổ in đạt thành tích tăng năng suất vượt định mức đã nhận kỷ niệm chương danh giá của Ban Giám đốc. Đồng thời, công đoàn ra mắt quỹ hỗ trợ đời sống anh em công nhân kỹ thuật ca đêm.",
    category: "Hoạt động đoàn thể",
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    createdAt: "2026-05-10T11:00:00Z",
    author: "Ban Chấp hành Công đoàn"
  },
  {
    id: "tin-5-hoi-thao",
    title: "Hội thao doanh nghiệp ITC lần thứ XI chào mừng ngày Giải Phóng",
    subtitle: "Gắn kết tinh thần đồng nghiệp khối văn phòng xưởng in cùng thi thố điền kinh cầu lông kịch tính.",
    content: "Hội thao truyền thống thu hút hơn 180 vận động viên thi đua sôi nổi tại trung tâm thể thao Nhị Xuân. Các trận cầu tranh đấu bóng đá mini kịch tính giữa phân xưởng In KTS và phân xưởng Thành phẩm đã kết thúc tốt đẹp. Hoạt động góp phần xây dựng văn hóa rèn luyện thể chất, đoàn kết cao trong doanh nghiệp.",
    category: "Hoạt động đoàn thể",
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    createdAt: "2026-05-08T16:00:00Z",
    author: "Đoàn Thanh niên"
  },
  {
    id: "tin-6-heidelberg",
    title: "Nâng cấp và số hóa dây chuyền in công suất cao Heidelberg Speedmaster từ CHLB Đức",
    subtitle: "Sẵn sàng đáp ứng khát vọng in nhanh, đồng màu mọi lô hàng vạn bản.",
    content: "Chúng tôi đã bổ sung mô-đun kết nối dữ liệu trung tâm Prinect Press Connection tích hợp cổng quét mật độ màu phân khúc cao thương hiệu Heidelberg. Tiến trình số hóa giúp xưởng tự sấy khô bằng hồng ngoại ngay khi giấy ra lô cuộn, tiết kiệm năng lượng 20% và tăng đáng kể độ bám màu nhạy nhiệt bảo an.",
    category: "Công nghệ in mới",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    createdAt: "2026-05-05T07:20:00Z",
    author: "Phòng Cơ điện & Thiết bị"
  },
  {
    id: "tin-7-qrcode",
    title: "Triển khai ứng dụng công nghệ mã vạch 2 chiều (QR Code) bảo mật trên vé số cào",
    subtitle: "Hỗ trợ khách hàng và đại lý tra cứu trúng thưởng nhanh qua liên thông Scanner.",
    content: "Từ tháng 5/2026, toàn bộ biểu mẫu xổ số cào kỹ thuật số xuất xưởng đều được phủ lớp mực chống soi cào thế hệ mới cùng dãy QR biến thiên mã hóa đầu cuối. Người dùng có thể cào nhẹ lớp nhũ niken và quét đối chiếu tức thời trên website hoặc ứng dụng đại lý, đảm bảo an toàn tuyệt mật phòng chống tráo số nhảy.",
    category: "Thông báo doanh nghiệp",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    createdAt: "2026-05-02T10:00:00Z",
    author: "Ban Điều hành Sản xuất"
  },
  {
    id: "tin-8-thien-nguyen",
    title: "Chương trình thiện nguyện 'Ánh Sáng Khát Vọng' giúp đỡ đồng bào vùng lũ",
    subtitle: "Tập thể cán bộ nhân viên quyên góp tiền lương trao tặng 150 suất quà nghĩa tình.",
    content: "Kế thừa văn hóa nhân ái kiến thiết Thủ Đô, đoàn thiện nguyện cán bộ nhân viên Xí nghiệp In cùng ban lãnh đạo đã di chuyển trực tiếp đến các gia đình chịu ảnh hưởng bão, trao nhiều vật phẩm học tập, dụng cụ sửa nhà và hỗ trợ tiền mặt thiết thực. Đây là cam kết cống hiến bền chí vì cộng đồng xã hội bền vững.",
    category: "Văn hoá doanh nghiệp",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    isPinned: false,
    createdAt: "2026-04-28T09:00:00Z",
    author: "Khối Tổ chức - Hành chính"
  }
];

// High quality API wraps with Firestore execution/error catching & LocalStorage backup fallback
export const newsService = {
  async bootstrap() {
    if (!isFirebaseAvailable) return;
    try {
      const q = query(collection(db, 'news'), limit(1));
      const snap = await getDocs(q);
      if (snap.empty) {
        console.log('Firestore is empty. Bootstrapping 8 default mock articles...');
        for (const post of DEFAULT_MOCK_NEWS) {
          await setDoc(doc(db, 'news', post.id), post);
        }
        console.log('Bootstrapping finished successfully!');
      }
    } catch (err) {
      console.warn('Bootstrap verification bypass probably due to security rules init delay:', err);
    }
  },

  async getAllNews(): Promise<NewsPost[]> {
    if (!isFirebaseAvailable) {
      // LocalStorage local fallback
      const cached = localStorage.getItem('local_news');
      if (cached) {
        return JSON.parse(cached);
      }
      localStorage.setItem('local_news', JSON.stringify(DEFAULT_MOCK_NEWS));
      return DEFAULT_MOCK_NEWS;
    }

    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const posts: NewsPost[] = [];
      snap.forEach((docSnap) => {
        posts.push({ ...docSnap.data() } as NewsPost);
      });
      
      // Seed if queried list is empty and server hasn't been bootstrapped
      if (posts.length === 0) {
        // Fallback to defaults
        return DEFAULT_MOCK_NEWS;
      }
      return posts;
    } catch (err) {
      console.error('Firestore list query failed. Yielding local backup dataset.', err);
      return DEFAULT_MOCK_NEWS;
    }
  },

  async addNews(post: Omit<NewsPost, 'id'> & { id?: string }): Promise<NewsPost> {
    const finalPost: NewsPost = {
      ...post,
      id: post.id || `news-${Date.now()}`
    };

    if (!isFirebaseAvailable) {
      const current = await this.getAllNews();
      const updated = [finalPost, ...current];
      localStorage.setItem('local_news', JSON.stringify(updated));
      return finalPost;
    }

    try {
      await setDoc(doc(db, 'news', finalPost.id), finalPost);
      return finalPost;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `news/${finalPost.id}`);
      throw err;
    }
  },

  async updateNews(id: string, post: Partial<NewsPost>): Promise<void> {
    if (!isFirebaseAvailable) {
      const current = await this.getAllNews();
      const idx = current.findIndex(p => p.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...post };
        localStorage.setItem('local_news', JSON.stringify(current));
      }
      return;
    }

    try {
      await updateDoc(doc(db, 'news', id), post as any);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `news/${id}`);
    }
  },

  async deleteNews(id: string): Promise<void> {
    if (!isFirebaseAvailable) {
      const current = await this.getAllNews();
      const filtered = current.filter(p => p.id !== id);
      localStorage.setItem('local_news', JSON.stringify(filtered));
      return;
    }

    try {
      await deleteDoc(doc(db, 'news', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `news/${id}`);
    }
  }
};
