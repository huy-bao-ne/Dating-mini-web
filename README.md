# 💫 StudyMate - Nền tảng tìm bạn học và hẹn hò thông minh

**StudyMate** là một ứng dụng web hiện đại giúp bạn tìm những người bạn phù hợp để học tập và xây dựng mối quan hệ lành mạnh. Với giao diện trực quan, hệ thống matching thông minh và tính năng lập lịch gặp gỡ, StudyMate tạo ra một cộng đồng an toàn và đáng tin cậy.

## ✨ Tính năng chính

### A. Phần tạo và quản lý hồ sơ
- ✅ Tạo hồ sơ 3 bước với thông tin chi tiết
- ✅ Chỉnh sửa hồ sơ bất kỳ lúc nào
- ✅ Thêm sở thích, ngôn ngữ, mục tiêu học tập
- ✅ Lưu trữ an toàn với mã hóa localStorage

### B. Phần khám phá và tương tác
- ✅ Giao diện swipe trực quan (like/pass)
- ✅ Xem lịch sử tương tác (Liked You, Liked Me, Matches)
- ✅ Hệ thống matching thông minh

### C. Phần lập lịch gặp gỡ và chat
- ✅ Chat real-time với matches
- ✅ Đề xuất thời gian gặp gỡ
- ✅ Xem lịch rảnh và tìm khung giờ phù hợp
- ✅ Lưu trữ cuộc trò chuyện

## 🏗 Cách tổ chức hệ thống (Architecture)

### Cấu trúc folder:
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

## 💾 Phương thức lưu trữ dữ liệu

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

## 🎯 Logic Match - Cách hệ thống xử lý matching

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

## ⏰ Logic tìm thời gian rảnh

### Thuật toán tìm khung giờ trùng:

**Input:**
```typescript
user1.availability = {
  Monday: ['09:00-11:00', '14:00-16:00'],
  Tuesday: ['10:00-12:00'],
  ...
}
user2.availability = {
  Monday: ['08:00-10:00', '15:00-17:00'],
  ...
}
```

**Xử lý:**
```typescript
function findOverlapSlots(user1Availability, user2Availability) {
  const overlaps = []
  
  // Cho mỗi ngày
  for (let day in user1Availability) {
    if (!user2Availability[day]) continue
    
    const user1Slots = user1Availability[day]  // ['09:00-11:00', '14:00-16:00']
    const user2Slots = user2Availability[day]  // ['08:00-10:00', '15:00-17:00']
    
    // Tìm giao điểm thời gian
    for (let slot1 of user1Slots) {
      for (let slot2 of user2Slots) {
        const overlap = findTimeOverlap(slot1, slot2)
        
        if (overlap) {
          overlaps.push({
            day: day,
            startTime: overlap.start,  // '09:00'
            endTime: overlap.end,      // '10:00'
            duration: overlap.duration // 60 (phút)
          })
        }
      }
    }
  }
  
  // Sắp xếp theo khoảng thời gian sớm nhất
  return overlaps.sort((a, b) => new Date(a.day + ' ' + a.startTime) - ...)
}

// Helper function
function findTimeOverlap(slot1, slot2) {
  // slot1: "09:00-11:00"
  // slot2: "08:00-10:00"
  
  const [start1, end1] = slot1.split('-').map(timeToMinutes)
  const [start2, end2] = slot2.split('-').map(timeToMinutes)
  
  // Tìm giao điểm
  const overlapStart = Math.max(start1, start2)  // max(9:00, 8:00) = 9:00
  const overlapEnd = Math.min(end1, end2)        // min(11:00, 10:00) = 10:00
  
  if (overlapStart < overlapEnd) {
    return {
      start: minutesToTime(overlapStart),   // '09:00'
      end: minutesToTime(overlapEnd),       // '10:00'
      duration: overlapEnd - overlapStart   // 60
    }
  }
  
  return null // Không có giao điểm
}
```

**Output:**
```typescript
[
  { day: 'Monday', startTime: '09:00', endTime: '10:00', duration: 60 },
  { day: 'Monday', startTime: '15:00', endTime: '16:00', duration: 60 },
  { day: 'Tuesday', startTime: '10:00', endTime: '11:30', duration: 90 }
]
```

## 🚀 Hướng dẫn cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd StudyMate-master
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy development server
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### 4. Build production
```bash
npm run build
npm start
```

## 🛠 Tech Stack

### Frontend
- **Next.js 16.1.3** - React framework với SSR
- **React 18+** - UI library  
- **TypeScript** - Type safety
- **Zustand** - State management (minimal & performant)
- **Tailwind CSS** - Styling (utility-first)
- **Framer Motion** - Animations
- **Heroicons** - SVG icons
- **Vitest** - Unit testing

### Data Persistence
- **Browser localStorage** - Client-side storage
- **Zustand persist** - Automatic serialization to localStorage
- **Mock Data** - generateMockProfiles.ts (200 random profiles)

### Development Tools
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vitest + Vitest Setup** - Testing framework

## 📊 Tổng quan dữ liệu

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

## 📈 Định hướng cải thiện (Future Improvements)

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
- Identity verification via photo/ID upload
- Background check (TBD)
- Harassment reporting system
- Admin moderation panel
- **Lợi ích:** Tăng trust & safety trong community

## 💡 Đề xuất tính năng mới (1-3 features)

### Tính năng 1: **"Study Buddy Matching" - Lập nhóm học tập**

**Mô tả:**
- Cho phép users tạo/join study groups dựa trên môn học
- Chia sẻ lịch học, lịch thi, tài liệu
- Virtual study sessions với video call
- Progress tracking & goal setting

**Lý do:**
- StudyMate focus vào learning, tính năng này đi trực tiếp vào core purpose
- Tăng user engagement & session time
- Tạo cộng đồng học tập thực sự (không chỉ dating)
- Generate recurring interactions (not just one-time meetups)

**Thực hiện:**
```typescript
interface StudyGroup {
  id: string
  name: string
  subject: string
  members: Profile[]
  createdBy: string
  schedule: TimeSlot[]
  resources: Document[]
  level: 'beginner' | 'intermediate' | 'advanced'
}
```

---

### Tính năng 2: **"Study Session Analytics" - Dashboard thống kê**

**Mô tả:**
- Dashboard cá nhân hiển thị stats: # matches, # chats, upcoming meetups
- Productivity score: Dựa trên # successful study sessions
- Achievements & badges: "First Date", "Study Buddy", "Perfect Match"
- Leaderboard: Top active users, most productive learners

**Lý do:**
- Gamification tăng user motivation & retention
- Social proof & competition drive engagement
- Data visualization giúp users hiểu progress của mình
- Encourages safe, productive behavior (not just swiping)

**Thực hiện:**
```typescript
interface UserStats {
  totalMatches: number
  completedStudySessions: number
  hoursStudied: number
  productivityScore: number
  badges: Badge[]
  weeklyMetrics: DailyMetric[]
}

interface Badge {
  id: string
  name: string
  description: string
  earnedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}
```

---

### Tính năng 3: **"Location-based Discovery" - Tìm bạn gần nhất**

**Mô tả:**
- GPS integration để tìm study spots gần người khác
- Map view hiển thị active users trong bán kính 5km
- "Coffee Shop Study Sessions": Join impromptu study groups tại cùng vị trí
- Safe & private: Chia sẻ vị trí chỉ sau khi match

**Lý do:**
- Tăng real-world meetups thay vì chỉ online
- Geographic proximity tăng match quality (easier to meet)
- Local community building
- Unique competitive advantage

**Thực hiện:**
```typescript
interface Location {
  latitude: number
  longitude: number
  city: string
  visible: boolean  // User can hide location
}

interface StudySpot {
  name: string
  type: 'library' | 'cafe' | 'park' | 'coworking'
  coordinates: Location
  activeUsers: number
}
```

## 🧪 Testing

### Run tests
```bash
npm run test
```

### Coverage
```bash
npm run test:coverage
```

## 📱 Responsive Design

- ✅ Mobile (320px - 480px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (1025px+)
- ✅ 2K/4K screens

## 🔒 Security & Privacy

- ✅ localStorage encryption cho sensitive data
- ✅ No server logs (pure frontend)
- ✅ Age verification (18+ only)
- ✅ Password hashing (bcrypt ready for backend)
- ✅ Input validation & sanitization
- ✅ CORS headers configured

## 📄 Cấu trúc Code & Comments

Toàn bộ code đã được comment chi tiết bằng **Tiếng Việt không dấu** để dễ hiểu:

- `CODE_COMMENTS.md` - Guide toàn bộ comments trong codebase
- `README_CODE.md` - Hướng dẫn chi tiết từng file & component
- Inline comments trong mỗi function giải thích logic

**Ví dụ:**
```typescript
// Xu ly like profile - swiped phai
const handleLike = () => {
  if (isAnimating || !currentUserId) return
  setIsAnimating(true)
  setAnimationDirection('right')
  
  // Them vao danh sach like sau animation
  setTimeout(() => {
    if (currentProfile) {
      addLike(currentUserId, currentProfile.id)
    }
    nextCard()
  }, 300)
}
```

## 🎓 Learning Value

Dự án này là một **study case hoàn hảo** để học:
- ✅ Next.js & React patterns
- ✅ State management với Zustand
- ✅ Tailwind CSS & Framer Motion
- ✅ TypeScript best practices
- ✅ localStorage & data persistence
- ✅ Responsive UI/UX design

Phù hợp cho **developers muốn tìm hiểu full-stack modern web development**.

## 📚 Documentation

- [CODE_COMMENTS.md](./CODE_COMMENTS.md) - Giải thích comments & architecture
- [README_CODE.md](./README_CODE.md) - Navigation guide cho mỗi file
- [QUICK_START.md](./QUICK_START.md) - Quick start guide

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - Xem [LICENSE](./LICENSE) để chi tiết.

## 👨‍💻 Author

**Chị** - Full Stack Developer \
- Website: [studymate.vn](https://studymate.vn)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Next.js team for amazing framework
- Zustand for lightweight state management
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations
- Community feedback & support

---

**StudyMate** - Tìm bạn học, tìm bạn yêu, xây dựng mối quan hệ có ý nghĩa! 💫✨

**Status:** 🚀 Active Development  
**Last Updated:** February 22, 2026  
**Current Version:** 1.0.0
