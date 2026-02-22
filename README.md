# Mini Dating App Prototype

🔗 **Live Demo:** [https://dating-mini-web.vercel.app/](https://dating-mini-web.vercel.app/)  
🔗 **GitHub Repository:** [https://github.com/huy-bao-ne/Dating-mini-web](https://github.com/huy-bao-ne/Dating-mini-web)

## 🎯 PHẦN I: GIẢI QUYẾT YÊU CẦU BÀI TEST (DELIVERABLES)

### 1. Cách tổ chức hệ thống (Architecture)

Dự án được xây dựng bằng **Next.js (App Router)** kết hợp **TypeScript** và quản lý state bằng **Zustand**. Hệ thống phân lớp rõ ràng để dễ bảo trì:

```text
app/
├── auth/login/           # Trang đăng nhập
├── discover/             # Trang chính: Giao diện swipe, xem lịch sử & matches
├── profile/              # Luồng tạo (3 bước) và chỉnh sửa profile
├── schedule/             # Xếp lịch gặp gỡ

components/
├── discover/             # Components cho swipe, chat, danh sách match
├── profile/              # Form xử lý dữ liệu người dùng
└── ui/                   # Shared components (ErrorBoundary, v.v.)

stores/                   # Zustand state management
├── profileStore.ts       # Quản lý data người dùng
├── matchStore.ts         # Quản lý lượt like & logic matches
└── schedulingStore.ts    # Quản lý lịch rảnh & hẹn

lib/                      # Utilities và mock data
```

**Luồng dữ liệu (Data Flow):**
```
User Input (UI) ↔️ React Component ↔️ Zustand Store ↔️ localStorage (Persist)
```

### 2. Phương thức lưu trữ dữ liệu

Không sử dụng backend phức tạp theo đúng tinh thần bài test, ứng dụng lưu trữ toàn bộ dữ liệu ở phía **Client** thông qua **localStorage** kết hợp với middleware **persist** của Zustand.

- **`profile-storage`**: Lưu thông tin các user
- **`match-storage`**: Lưu lịch sử Like và Match
- **`scheduling-storage`**: Lưu các slot thời gian đã chọn

Dữ liệu tự động serialize sang JSON, đảm bảo trạng thái không bị mất khi reload trang.

### 3. Logic Match hoạt động thế nào?

Hệ thống xử lý **realtime** ngay khi user thực hiện thao tác **Swipe Right** (Like).

**Thuật toán:**

1. **Lưu record**: Thêm ID người được like vào `Set` likes của người thao tác
2. **Kiểm tra Mutual Like**: Truy vấn ngược lại xem đối phương đã like mình chưa
3. **Tạo Match**: Nếu tồn tại Mutual Like, hệ thống khởi tạo một Match object chứa ID của 2 người và kích hoạt thông báo "It's a Match"

```typescript
function getMatches(userId: string) {
  const myLikes = likes[userId] || new Set()
  
  for (let likedUserId of myLikes) {
    const theirLikes = likes[likedUserId] || new Set()
    
    if (theirLikes.has(userId)) {
      addToMatches(userId, likedUserId) // MATCH!
    }
  }
}
```

### 5. Định hướng cải thiện (Nếu có thêm thời gian)

1. **Backend API Integration**: Thay thế localStorage bằng Node.js/Express + PostgreSQL để đồng bộ đa thiết bị và tăng bảo mật
2. **Real-time Chat (WebSocket)**: Tích hợp Socket.io/Pusher để chat real-time, có typing indicators
3. **Advanced Matching Algorithm**: Chấm điểm độ tương thích (Compatibility Score) dựa trên thuật toán tính điểm sở thích, độ tuổi, khoảng cách địa lý

### 6. Đề xuất 3 tính năng mới cho sản phẩm

#### Tính năng 1: **"Study Buddy Matching"** (Lập nhóm học tập)
- **Mô tả**: Mở rộng tính năng tìm bạn 1-1 thành nhóm dựa trên môn học/kỹ năng
- **Lý do**: Tăng User Engagement, tạo cộng đồng giữ chân người dùng lâu dài (không chỉ dừng lại ở 1 lần hẹn)

#### Tính năng 2: **"Profile Verification"** (Xác thực hồ sơ)
- **Mô tả**: Yêu cầu user chụp ảnh selfie theo pose ngẫu nhiên để nhận **Tick Xanh**
- **Lý do**: Giải quyết vấn nạn Catfish/Fake account, xây dựng môi trường an toàn và đáng tin cậy

#### Tính năng 3: **"Location-based Discovery"** (Gợi ý địa điểm)
- **Mô tả**: Tự động gợi ý 3 quán cafe/thư viện nằm giữa vị trí của 2 người ngay khi tìm được Slot thời gian trùng
- **Lý do**: Cắt giảm rào cản ra quyết định, thúc đẩy gặp mặt offline nhanh chóng đúng với tinh thần "Breeze App"

---

## 💻 PHẦN II: TỔNG QUAN KỸ THUẬT VÀ TÍNH NĂNG

## ✨ Tính năng đã triển khai

### A. Profile (Hồ sơ người dùng)
- ✅ Luồng đăng ký 3 bước mượt mà (Tên, Tuổi, Bio, Sở thích...)
- ✅ Tạo hồ sơ với thông tin chi tiết: giới tính, chiều cao, thành phố, công việc, ngôn ngữ, học vấn
- ✅ Chỉnh sửa hồ sơ bất kỳ lúc nào
- ✅ Lưu trữ an toàn với localStorage persistence

### B. Discovery & Interaction (Khám phá và tương tác)
- ✅ Giao diện swipe **Tinder-like** với Framer Motion (animations vuốt chạm mượt mà)
- ✅ Like/Pass profiles với hiệu ứng animation chuyên nghiệp
- ✅ Xem lịch sử tương tác được phân loại rõ ràng:
  - **Liked By Me**: Người mình đã like
  - **Liked You**: Người đã like mình
  - **Perfect Matches**: Cả hai cùng like nhau
  - **Messages**: Cuộc trò chuyện với matches

### C. Scheduling & Chat (Lập lịch gặp gỡ và chat)
- ✅ Chat real-time với matches
- ✅ Đề xuất thời gian gặp gỡ thông minh
- ✅ **Logic cross-matching thời gian rảnh** chuẩn xác (tìm slot trùng đầu tiên)
- ✅ Lưu trữ cuộc trò chuyện persistent
- ✅ Auto-response simulation cho demo purposes

---

## 🏗 Chi tiết Architecture & Data Flow

---

## 🏗 Chi tiết Architecture & Data Flow

### Cấu trúc folder chi tiết:
```
app/
├── auth/login/           # Trang đăng nhập
├── discover/             # Trang chính (swipe)
│   ├── page.tsx          # Giao diện swipe profile
│   ├── browse/           # Xem lịch sử & matches
│   └── swipe/            # Trang swipe chi tiết
├── profile/
│   ├── create/           # Tạo profile 3 bước
│   └── edit/             # Chỉnh sửa profile
├── schedule/             # Xếp lịch gặp gỡ
│── layout.tsx            # Layout chính
└── page.tsx              # Landing page

components/
├── discover/
│   ├── MatchesPerfect.tsx      # Modal scheduling + chat
│   ├── Messages.tsx             # Giao diện chat
│   ├── LikedByMe.tsx            # Danh sách người like mình
│   ├── LikedYou.tsx             # Danh sách người mình like
│   └── Matches.tsx              # Danh sách matches
├── profile/
│   └── CreateProfileForm.tsx    # Form tạo profile
├── landing/              # Components landing page
└── ui/
    └── ErrorBoundary.tsx # Error handling

stores/                  # Zustand state management
├── profileStore.ts      # Quản lý profile
├── matchStore.ts        # Quản lý likes & matches
└── schedulingStore.ts   # Quản lý lịch gặp gỡ

lib/
├── mockData.ts          # Dữ liệu mock profiles
└── utils/               # Utility functions
```

### Luồng dữ liệu:
```
User Input (UI) → React Component → Zustand Store → localStorage
                                        ↓
                                   State update
                                        ↓
                                   UI Re-render
```

```

---

## 💾 Chi tiết Phương thức lưu trữ dữ liệu

### 1. **Zustand State Management**
```typescript
// profileStore: Lưu trữ thông tin người dùng
- currentUserId: ID user hiện tại
- allProfiles: Danh sách tất cả profiles
- createProfile(): Tạo profile mới
- updateProfile(): Cập nhật thông tin

// matchStore: Quản lý likes & matches
- likes: Record<string, Set<string>> (userId -> set of liked userIds)
- addLike(userId, likedUserId): Thêm like
- removeLike(userId, likedUserId): Xóa like
- getMatches(userId): Lấy danh sách matches

// schedulingStore: Quản lý thời gian gặp gỡ
- scheduled: Record<string, TimeSlot> (userId -> scheduled times)
- addScheduling(): Thêm thời gian gặp
```

### 2. **localStorage Persistence**
```typescript
// Tự động persist Zustand stores
persist({
  name: 'profile-storage',   // Lưu profile data
  name: 'match-storage',      // Lưu match data
  name: 'scheduling-storage'  // Lưu scheduling data
})

// Dữ liệu được lưu dưới dạng JSON
// Tự động load khi ứng dụng khởi động
```

### 3. **Mock Data**
```typescript
// generateMockProfiles.ts: Tạo 200 profiles giả cho testing
- Mỗi profile có: id, name, age, gender, bio, hobbies, education...
- Dữ liệu ngẫu nhiên nhưng realistic
- Được load vào store lúc khởi động
```

```

---

## 🎯 Chi tiết Logic Match - Cách hệ thống xử lý matching

### Thuật toán Matching:

**Bước 1: Tìm Mutual Likes (Hai chiều)**
```typescript
function getMatches(userId: string) {
  // Lấy danh sách người mình đã like
  const myLikes = likes[userId] || new Set()
  
  // Cho mỗi người mình like
  for (let likedUserId of myLikes) {
    // Kiểm tra họ có like mình không
    const theirLikes = likes[likedUserId] || new Set()
    
    // Nếu cả hai cùng like nhau -> MATCH!
    if (theirLikes.has(userId)) {
      addToMatches(userId, likedUserId)
    }
  }
}
```

**Bước 2: Phân loại Matches**
```typescript
- Perfect Matches:      Cả hai cùng like nhau ✅
- Liked By Me:          Mình like nhưng họ chưa
- Liked You:            Họ like nhưng mình chưa
- Messages:             Đã match và có chat
```

**Bước 3: Tính điểm Compatibility**
```typescript
function calculateCompatibility(user1, user2) {
  let score = 0
  
  // Tuổi: ±3 năm = 20 điểm
  if (Math.abs(user1.age - user2.age) <= 3) score += 20
  
  // Sở thích chung: 1 chung = 10 điểm (max 30)
  const commonHobbies = user1.hobbies.filter(h => user2.hobbies.includes(h))
  score += Math.min(commonHobbies.length * 10, 30)
  
  // Giáo dục: Nếu cùng level = 20 điểm
  if (user1.education === user2.education) score += 20
  
  // Ngôn ngữ: Có ít nhất 1 ngôn ngữ chung = 15 điểm
  const commonLanguages = user1.languages.filter(l => user2.languages.includes(l))
  if (commonLanguages.length > 0) score += 15
  
  // Mục địa: Cùng thành phố = 15 điểm
  if (user1.city === user2.city) score += 15
  
  return score // Tổng max: 100
}
```

```

## 🚀 Hướng dẫn khởi chạy (Local Setup)

### 1. Clone repository
```bash
git clone https://github.com/huy-bao-ne/Dating-mini-web
cd StudyMate-master
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy development server
```bash
npm run dev
# Mở http://localhost:3000
```

### 4. Build production
```bash
npm run build
npm start
```

### 5. Chạy Unit Test
```bash
npm run test
```

---

---

## 🛠 Tech Stack đầy đủ

### Frontend
- **Next.js 16.1.3** - React framework với App Router & SSR
- **React 19+** - UI library  
- **TypeScript** - Type safety & developer experience
- **Zustand** - State management (minimal & performant, có persist middleware)
- **Tailwind CSS** - Styling (utility-first approach)
- **Framer Motion** - Professional animations cho swipe gestures
- **Heroicons** - Beautiful SVG icons
- **Vitest** - Fast unit testing framework

### Form & Validation
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation (tuổi 18+, email format, text length)

### Data Persistence
- **Browser localStorage** - Client-side storage (không cần backend)
- **Zustand persist middleware** - Automatic serialization to localStorage
- **Mock Data Generator** - generateMockProfiles.ts (200 realistic profiles)

### Development Tools
- **TypeScript** - Static type checking
- **ESLint** - Code linting & best practices
- **PostCSS** - CSS processing
- **Vitest + Vitest Setup** - Testing framework & configuration

---

---

## 📊 Data Models (Tổng quan dữ liệu)

### Profile Data Model
```typescript
interface Profile {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  bio: string
  email: string
  password: string
  height: number
  city: string
  job: string
  hobbies: string[]
  languages: string[]
  education: string
  createdAt: Date
  likeCount: number
}
```

### Match Data Model
```typescript
interface Match {
  mutual: Profile[]        // Cả hai cùng like
  likedByMe: Profile[]     // Mình like
  likedYou: Profile[]      // Họ like
}
```

### Conversation Model
```typescript
interface Conversation {
  profileId: string
  profileName: string
  messages: Message[]
  lastMessage: string
  lastMessageTime: Date
}

interface Message {
  sender: 'user' | 'opponent'
  text: string
  timestamp?: Date
}
```

```

---

## 📈 Định hướng cải thiện & Mở rộng (Future Improvements)

Nếu có thêm thời gian, tôi sẽ nâng cấp các phần sau:

### 1. **Backend API Integration** 🔧
- Thay thế mock data bằng real backend (Node.js + Express)
- Tích hợp PostgreSQL database
- Implement REST API endpoints
- Add user authentication (JWT, OAuth)
- **Lợi ích:** Tăng bảo mật, mở rộng dữ liệu, multi-device sync

### 2. **Real-time Chat & Notifications** 💬
- Tích hợp WebSocket (Socket.io hoặc Pusher)
- Real-time message delivery
- Typing indicators + read receipts
- Push notifications
- **Lợi ích:** Trải nghiệm người dùng tốt hơn, engagement cao

### 3. **Advanced Matching Algorithm** 🤖
- Machine Learning model để gợi ý từng cá nhân
- Tính toán compatibility score (hiện tại base)
- Personalized recommendations
- A/B testing các algorithms
- **Lợi ích:** Tăng match success rate, user retention

### 4. **Video Call Integration** 📹
- Tích hợp WebRTC hoặc Twilio
- In-app video/audio calling
- Screen sharing cho study sessions
- Call recording (optional, with consent)
- **Lợi ích:** Virtual dating/studying, safer meetups

### 5. **User Safety & Verification** 🔒
- Email verification
- Identity verification via photo/ID upload (selfie pose ngẫu nhiên)
- Background check (TBD)
- Harassment reporting system
- Admin moderation panel
- **Lợi ích:** Tăng trust & safety trong community, giảm fake accounts

---

## 👨‍💻 Author & Contact

**Nguyễn Huy Bảo** - Web Developer Intern Candidate  
*Position:* Web Developer Intern tại **Clique83.com**

- 🌐 **Live Demo:** [https://dating-mini-web.vercel.app/](https://dating-mini-web.vercel.app/)
- 💻 **GitHub:** [https://github.com/huy-bao-ne/Dating-mini-web](https://github.com/huy-bao-ne/Dating-mini-web)
- 📧 **Email:**  huybaonguyen9505@gmail.com

*Clique83.com Web Developer Intern Position*
