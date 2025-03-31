# ✨ Ghibli Art Generator

<div align="center">

![Ghibli Art Generator Banner](https://raw.githubusercontent.com/Aravinds2006/ghibli-art-generator/main/public/banner.png)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Hugging Face](https://img.shields.io/badge/Hugging%20Face-API-orange?logo=huggingface)](https://huggingface.co/)

Transform your imagination into Studio Ghibli-style artwork using AI ✨

[Get Started](#getting-started) • [Features](#features) • [Demo](#demo)

</div>

## 🌟 Features

<div align="center">

| 🎨 Text-to-Art | 📸 Image Reference | 🌟 Animated Background | 🎯 Modern UI |
|:-------------:|:-----------------:|:-------------------:|:-----------:|
| Generate Ghibli-style artwork from text descriptions | Upload reference images for visual context (Under Testing) | Beautiful Three.js animated background | Sleek interface with Next UI & Material UI |

</div>

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Hugging Face API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ghibli-art-generator.git
   cd ghibli-art-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Hugging Face API key to `.env.local`:
   ```
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🎨 Usage

1. Enter a text description of your desired Ghibli-style scene
2. (Optional) Upload a reference image for visual context
3. Click "Create Ghibli Magic ✨" to generate your artwork
4. Download the generated image using the download button

## 🛠️ Technology Stack

<div align="center">

| Frontend | Backend | AI/ML | UI/UX |
|:--------:|:-------:|:-----:|:-----:|
| Next.js 14 | Node.js | Hugging Face API | Next UI |
| TypeScript | Express | Ghibli-Diffusion | Material UI |
| React Three Fiber | Three.js | Stable Diffusion | Tailwind CSS |

</div>

### Key Technologies

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **UI Libraries:** 
  - [Next UI](https://nextui.org/)
  - [Material UI](https://mui.com/)
  - [Tailwind CSS](https://tailwindcss.com/)
- **3D Graphics:** [Three.js](https://threejs.org/) with [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Image Generation:** [Hugging Face API](https://huggingface.co/) with [Ghibli-Diffusion](https://huggingface.co/nitrosocke/Ghibli-Diffusion) model by nitrosocke
- **Image Upload:** [React Dropzone](https://react-dropzone.js.org/)
- **TypeScript:** For type safety

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Studio Ghibli](https://www.ghibli.jp/) for their magical artwork
- [nitrosocke](https://huggingface.co/nitrosocke) for the [Ghibli-Diffusion](https://huggingface.co/nitrosocke/Ghibli-Diffusion) model
- All contributors and supporters of this project

---

<div align="center">

Made with ❤️ by [Aravindselvan](https://github.com/Aravinds2006)

[![Twitter](https://img.shields.io/badge/Twitter-@Aravinds2006-blue?logo=twitter)](https://twitter.com/Aravinds2006)
[![GitHub](https://img.shields.io/badge/GitHub-Aravinds2006-black?logo=github)](https://github.com/Aravinds2006)
[![Instagram](https://img.shields.io/badge/Instagram-nova__trades-pink?logo=instagram)](https://instagram.com/nova__trades)

</div>
