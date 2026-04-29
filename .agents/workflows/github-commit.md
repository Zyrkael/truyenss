---
description: Tự động stage, commit và push code theo chuẩn Conventional Commits.
---

# Git Commit & Push Workflow

// turbo-all

- `/cp`: Khi nhận được lệnh này, hãy thực hiện các bước sau để commit và push code:
    1. Kiểm tra danh sách các file đã thay đổi (`git status`).
    2. Phân loại các thay đổi: Nếu các file thuộc về các phạm vi (scope) hoặc mục đích khác nhau (ví dụ: một file sửa UI, một file sửa logic API), hãy chia thành các nhóm commit riêng biệt.
    3. Với mỗi nhóm thay đổi:
        a. Chạy `git add <các_file_liên_quan>`.
        b. Tạo message commit chuẩn Conventional Commits bằng tiếng Việt cho nhóm đó (ví dụ: `feat(ui): ...` hoặc `fix(api): ...`).
        c. Thực hiện commit.
    4. Nếu tất cả thay đổi đều cùng mục đích, có thể dùng `git add .` và commit một lần.
    5. Sau khi hoàn thành tất cả các commit, chạy `git push`.