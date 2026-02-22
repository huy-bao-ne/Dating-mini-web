#  Code Comments Guide

## Cấu trúc chính của ứng dụng

### **Phần A: Tạo Profile** (`/app/profile/create/page.tsx`)
```
1. User tạo profile với thông tin cơ bản:
   - Tên, tuổi, giới tính, bio, email
   - Mật khẩu để bảo mật tài khoản
   - Dữ liệu lưu vào localStorage

2. Chi tiết cá nhân (Step 2):
   - Chiều cao, thành phố, công việc, học vấn
   
3. Ưa thích (Step 3):
   - Sở thích (hobbies) - có thể thêm custom
   - Ngôn ngữ nói được
```

### **Phần B: Hiển thị & Like** (`/app/discover/page.tsx`)
```
1. Duyệt qua profile:
   - Hiển thị lần lượt từng profile
   - Nút "Không" (pass) hoặc "Thích" (like)
   - Nút "Chi tiết" để xem thêm thông tin

2. Auto-detect match:
   - Nếu A thích B và B thích A → "It's a Match!" 🎉
   - Lưu vào matchStore tự động
   
3. Màn hình lịch sử (`/app/discover/browse/page.tsx`):
   - Tab "❤️ Được thích" - những người thích tôi chưa thích lại
   - Tab "💕 Thích" - những người tôi thích chưa thích lại  
   - Tab "🎉 Matches" - những người match (thích lẫn nhau)
   - Tab "💬 Tin nhắn" - chat với các matches
```

### **Phần C: Đặt Lịch Hẹn + Chat** (`/components/discover/MatchesPerfect.tsx`)
```
1. Scheduling Modal:
   - Chọn ngày (date picker)
   - Chọn khung giờ (7 time slots: 09:00-20:00)
   - Hoặc nhập giờ tùy ý (HH:MM format)
   
2. Auto-response:
   - Sau 1.5s, hệ thống gia lập phản hồi từ đối phương
   - Thường là chấp nhận thời gian gợi ý
   
3. Chuyển sang Chat Mode:
   - Sau khi xác nhận, modal chuyển sang chat interface
   - Có thể nhắn tin và lưu conversation
   
4. Message Sync:
   - Tin nhắn được lưu vào conversations state
   - Hiển thị trên tab "💬 Tin nhắn"
   - Auto-navigate khi click "Nhắn tin"
```

## File Structure & State Management

### **Stores** (Zustand + localStorage)
```typescript
// profileStore - Quản lý profile người dùng hiện tại
- currentProfile: Profile | null
- allProfiles: Profile[] (lưu tất cả profile từng tạo)
- setCurrentProfile(profile)
- addProfile(profile)
- clearCurrentProfile()

// matchStore - Quản lý lượt like
- likes: Like[] (ai đã thích ai)
- checkIfUserLiked(userId, targetId) → boolean
- addLike(userId, targetId)
- removeLike(userId, targetId)

// Conversation data (state trong components)
- conversations: Record<profileId, Conversation>
- Conversation = { profileId, profileName, messages, lastMessage, lastMessageTime }
- Message = { sender: 'user' | 'opponent', text, timestamp }
```

### **Component Props**
```typescript
// MatchesPerfect Props
- profiles: Profile[] (danh sách match)
- currentUserId: string (id user hiện tại)
- onSaveConversation?: (profileId, profileName, messages) => void
- onNavigateToMessages?: (profileId, profileName) => void

// Messages Props
- conversations: Record<profileId, Conversation>
- onSendMessage: (profileId, message) => void
- initialSelectedProfile?: string
```

## User Flow

```
[Trang chủ]
    ↓
[Tạo Profile] (Phần A)
    ↓
[Duyệt Profile] (Phần B - discover/page)
    ├─ Scroll/Swipe qua từng profile
    ├─ Click "Thích" → lưu vào matchStore
    └─ Tự động detect match nếu cả hai thích nhau
    ↓
[Xem Lịch Sử] (browse/page)
    ├─ Tab "Được thích" - lọc những người thích tôi
    ├─ Tab "Thích" - lọc những người tôi thích
    ├─ Tab "Matches" 🎉
    │   ├─ Click card → mở scheduling modal
    │   ├─ Chọn ngày/giờ → gửi đề xuất
    │   └─ Nhận phản hồi từ đối phương → chuyển sang chat
    └─ Tab "Tin nhắn" - nhắn tin với matched users
```

## Key Logic Explanations

### **Phân loại profile trong browse/page.tsx**
```javascript
// Perfect Matches = những người match đôi chiều
- Tôi thích A AND A thích tôi

// "Được thích" 
- A thích tôi BUT tôi chưa thích A lại
- Gợi ý: nhấn "Thích" để tạo match

// "Thích"
- Tôi thích A BUT A chưa thích tôi lại  
- Gợi ý: chờ A phản hồi hoặc thử liên lạc
```

### **Time Slot Selection**
```javascript
// 7 mốc giờ có sẵn:
09:00 - 10:00
10:00 - 11:00
14:00 - 15:00
15:00 - 16:00
16:00 - 17:00
18:00 - 19:00
19:00 - 20:00

// Hoặc người dùng có thể nhập giờ tùy ý theo format HH:MM
```

### **Auto-Response Simulation**
```javascript
// Khi user xác nhận thời gian:
1. Lưu thời gian vào userTimeSelection[profileId]
2. Thêm tin nhắn vào messages[profileId]
3. Sau 1.5s → Gia lập phản hồi từ đối phương
4. Chuyển sang chat mode (chatMode[profileId] = true)
5. Người dùng có thể tiếp tục nhắn tin
```

## 📱 Component Hierarchy

```
app/
├─ discover/
│  ├─ page.tsx (Main swipe interface)
│  ├─ browse/page.tsx (History & matches)
│  └─ matches/page.tsx 
├─ profile/
│  ├─ create/page.tsx (Profile creation form)
│  └─ edit/page.tsx
└─ auth/login/page.tsx

components/
├─ discover/
│  ├─ MatchesPerfect.tsx (Scheduling + Chat modal)
│  ├─ Messages.tsx (Chat interface)
│  ├─ LikedByMe.tsx (Profile cards - liked by me)
│  ├─ Matches.tsx (Profile cards - perfect matches)
│  ├─ LikedYou.tsx (Profile cards - who liked me)
│  └─ Others...
├─ landing/
│  ├─ LandingHero.tsx
│  ├─ LandingFeatures.tsx
│  └─ ...
└─ profile/
   └─ CreateProfileForm.tsx

stores/
├─ profileStore.ts (User profile management)
└─ matchStore.ts (Like/match tracking)
```

## Color & Icon Scheme

```typescript
// Tab Primary Colors
❤️  "Được thích"  → Rose/Pink gradient
💕  "Thích"       → Rose/Pink gradient  
🎉  "Matches"     → Green/Emerald (success)
💬  "Tin nhắn"    → Blue/Purple gradient

// Action Buttons
✨  "Chi tiết"    → Purple outline
❤️  "Thích (Like)" → Rose/Pink filled
❌  "Không (Pass)" → Gray outline
✈️  "Gửi tin nhắn"→ Blue filled
📅  "Scheduled"   → Amber/Yellow success
```

## Common Issues & Solutions

### **Messages not saving?**
- Check: `onSaveConversation` callback is passed from parent
- Verify: conversations state is being updated correctly
- Debug: Check browser localStorage under 'conversations'

### **Auto-response not appearing?**
- Check: `setTimeout` is running after button click
- Verify: chatMode toggle happens AFTER message added
- Debug: Messages array is being updated in correct order

### **Match not detecting?**
- Check: Both users' IDs are stored correctly in matchStore
- Verify: `checkIfUserLiked` logic is bidirectional
- Debug: Check likes array in localStorage/DevTools

### **Scheduling modal not opening?**
- Check: Profile ID is being passed correctly
- Verify: `schedulingModal` state is being set
- Debug: Console log to verify onClick handler runs

##Important Notes

1. **Dữ liệu lưu ở đâu:**
   - Profile: Zustand + localStorage
   - Likes/Matches: Zustand + localStorage  
   - Conversations: Component state (có option lưu callback)
   - Mock data: localStorage một lần khi load

2. **Không có backend:**
   - Tất cả auto-response được gia lập (simulate)
   - Dữ liệu người khác là mock data tĩnh
   - Thích/match chỉ lưu cục bộ

3. **vietnameseCommentsNoPhrasals:**
   - Tất cả comments sử dụng Tiếng Việt không dấu
   - Format: lowercase, no spaces at start

