# 📚 How to Publish Your School Library Website

**A simple guide for teachers and librarians (no coding experience needed!)**

Your School Library website is ready to go live! Follow these easy steps to publish it online for free.

---

## 🎯 What You'll Get

Once published, your website will:
- ✅ Run 24/7 on the internet (you don't need to keep your computer on!)
- ✅ Be accessible from any device (phones, tablets, computers)
- ✅ Have a web address like: `https://yourname.github.io/school-library`
- ✅ Update automatically when you make changes

---

## 📋 What You Need

- A computer with internet connection
- 15 minutes of your time
- A free GitHub account (we'll help you create one)

---

## 🚀 Step-by-Step Publishing Guide

### Step 1: Create a GitHub Account (5 minutes)

1. **Go to GitHub**
   - Open your web browser
   - Visit: [github.com](https://github.com)

2. **Sign Up**
   - Click the green "Sign up" button
   - Choose a username (this will be part of your website address)
   - Use your school email address
   - Create a strong password
   - Complete the verification

3. **Verify Your Email**
   - Check your email inbox
   - Click the verification link GitHub sent you

### Step 2: Create Your Website Repository (3 minutes)

1. **Create New Repository**
   - On GitHub, click the green "New" button (or the "+" icon in top right)
   - Repository name: `school-library`
   - Description: `Gentle book discovery for students`
   - Make sure it's set to **Public** (this is required for free hosting)
   - **Don't check** "Add a README file" (we already have one)
   - Click "Create repository"

2. **Copy the Repository Address**
   - You'll see a page with commands
   - Look for the HTTPS address that looks like: `https://github.com/YOURUSERNAME/school-library.git`
   - Copy this address (you'll need it in Step 3)

### Step 3: Upload Your Website (5 minutes)

1. **Open Your Computer's Terminal/Command Prompt**
   - **Windows**: Press `Windows key + R`, type `cmd`, press Enter
   - **Mac**: Press `Cmd + Space`, type `terminal`, press Enter

2. **Navigate to Your Website Folder**
   ```
   cd "C:\Users\vishw\OneDrive\Documents\website2"
   ```
   *(Replace with the actual path to your website folder)*

3. **Connect to GitHub (Using HTTPS)**
   ```
   git remote add origin https://github.com/YOURUSERNAME/school-library.git
   ```
   *(Replace YOURUSERNAME with your actual GitHub username)*
   
   **If you get "origin already exists" error:**
   ```
   git remote set-url origin https://github.com/YOURUSERNAME/school-library.git
   ```

4. **Set Up Authentication (One-time setup)**
   ```
   git config --global user.name "Your Name"
   git config --global user.email "your.email@school.edu"
   ```
   *(Replace with your actual name and school email)*

5. **Upload Your Website**
   ```
   git branch -M main
   git push -u origin main
   ```
   
   **⚠️ If you get "Permission denied (publickey)" error:**
   ```
   git remote set-url origin https://github.com/YOURUSERNAME/school-library.git
   git push -u origin main
   ```

6. **Create a Personal Access Token (First time only)**
   
   GitHub no longer accepts passwords for command line access. You need a "Personal Access Token":
   
   1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
   2. Click "Generate new token" → "Generate new token (classic)"
   3. Give it a name like "School Library Website"
   4. Set expiration to "No expiration" (for simplicity)
   5. Check the "repo" box (this gives full repository access)
   6. Click "Generate token"
   7. **IMPORTANT**: Copy the token immediately and save it somewhere safe (you won't see it again!)

7. **Enter Your GitHub Credentials**
   - When prompted for username: enter your GitHub username
   - When prompted for password: paste your Personal Access Token (not your GitHub password!)

### Step 4: Enable Website Hosting (2 minutes)

1. **Go to Your Repository Settings**
   - Visit your repository on GitHub: `https://github.com/YOURUSERNAME/school-library`
   - Click the "Settings" tab (at the top of the page)

2. **Enable GitHub Pages**
   - Scroll down to find "Pages" in the left sidebar
   - Click on "Pages"
   - Under "Source", select "GitHub Actions"
   - Click "Save"

3. **Wait for Your Website to Build**
   - GitHub will automatically build your website (this takes 2-5 minutes)
   - You'll see a green checkmark when it's ready

### Step 5: Visit Your Live Website! 🎉

Your website will be live at:
```
https://YOURUSERNAME.github.io/school-library
```

*(Replace YOURUSERNAME with your actual GitHub username)*

---

## 🔄 Making Updates Later

When you want to add new books or make changes:

1. **Make your changes** in the website files on your computer
2. **Save and upload** the changes:
   ```
   git add .
   git commit -m "Added new books"
   git push
   ```
3. **Wait 2-3 minutes** for the website to update automatically

---

## 🆘 Need Help?

### Common Issues:

**"Permission denied (publickey)" error?** ⭐ MOST COMMON
- This means Git is trying to use SSH instead of HTTPS
- **SOLUTION**: Run this command first:
  ```
  git remote set-url origin https://github.com/YOURUSERNAME/school-library.git
  ```
- Then try pushing again: `git push -u origin main`
- Make sure you have a Personal Access Token (see Step 6 above)
- Use your token as the password when prompted

**"Origin already exists" error?**
- Use this command instead: `git remote set-url origin https://github.com/YOURUSERNAME/school-library.git`
- Then continue with: `git branch -M main` and `git push -u origin main`

**"Command not found" error?**
- Make sure you're in the correct folder
- Try opening a new terminal/command prompt

**Authentication failed error?**
- Make sure you're using your Personal Access Token as the password (not your GitHub password)
- Double-check your GitHub username is correct
- Create a new Personal Access Token if needed

**Website not loading?**
- Wait 5-10 minutes after enabling GitHub Pages
- Check that your repository is set to "Public"
- Make sure the repository name is exactly `school-library`

### Getting More Help:

1. **GitHub Documentation**: [docs.github.com/pages](https://docs.github.com/pages)
2. **Ask a Tech-Savvy Colleague**: Show them this guide
3. **Contact Your IT Department**: They can help with the terminal commands

---

## 🎊 Congratulations!

Your School Library website is now live on the internet! Students can:

- 📱 Access it from any device
- 🔍 Discover books by mood and interest
- 💝 Save their favorite books
- ✨ Celebrate their reading achievements
- 📚 Track their reading journey

**The website runs automatically - you don't need to do anything else!**

---

## 📝 Quick Reference

- **Your website address**: `https://YOURUSERNAME.github.io/school-library`
- **To make updates**: Edit files → `git add .` → `git commit -m "message"` → `git push`
- **GitHub repository**: `https://github.com/YOURUSERNAME/school-library`

**Happy reading! 🌼**