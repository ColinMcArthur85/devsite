<!DOCTYPE html>
<html lang="en" class="scroll-smooth">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0070f3">
  <meta name="description" content="Colin McArthur Developer Portfolio Site">
  <link rel="stylesheet" href="./assets/css/style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Camingo+Code:wght@400;700&display=swap" rel="stylesheet" />

  <title>Tailwind Template</title>
</head>

<body class="font-sans text-gray-900 dark:text-white bg-white dark:bg-dark-background transition-colors duration-300">
  <!-- Dark mode background gradients -->
  <div class="fixed inset-0 -z-10 opacity-0 dark:opacity-100 transition-opacity duration-500 pointer-events-none">
    <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
  </div>

  <!-- Header -->
  <header class="fixed w-full top-0 z-50 bg-white/95 dark:bg-dark-background/95 backdrop-blur-sm shadow-sm transition-all duration-300">
    <div class="container mx-auto px-4">
      <nav class="flex justify-between items-center py-4">
        <div flex items-center>
          <span class="text-xl font-extrabold">Colin McArthur</span>
          <span class="text-primary text-2xl ml-1">●</span>
        </div>
        <ul class="hidden md:flex space-x-8">
          <li>
            <a href="#features" class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Showcase</a>
          </li>
          <li>
            <a href="#about" class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">About</a>
          </li>
          <li>
            <a href="#skills" class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Skills</a>
          </li>
          <li>
            <a href="#projects" class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Projects</a>
          </li>
          <li>
            <a href="#contact" class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Contact</a>
          </li>
        </ul>
        <div class="flex items-center space-x-4">
          <button id="themeToggle" class=""><i class="fa-solid fa-moon text-gray-600 dark:text-gray-400"></i></button>
          <button id="menuToggle" class="md:hidden p-2">
            <div class="w-6 h-5 flex flex-col justify-between">
              <span class="w-full h-0.5 bg-gray-600 dark:bg-gray-400 transition-all"></span>
              <span class="w-full h-0.5 bg-gray-600 dark:bg-gray-400 transition-all"></span>
              <span class="w-full h-0.5 bg-gray-600 dark:bg-gray-400 transition-all"></span>
            </div>
          </button>
        </div>
      </nav>
    </div>
  </header>
  <!-- Mobile Menu -->
  <div id="mobileMenu" class="fixed inset-0 bg-white dark:bg-dark-background z-50 transform translate-x-full  duration-300 md:hidden">
    <div class="container mx-auto px-4 h-full flex flex-col">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center">
          <span class="text-xl font-extrabold">Colin McArthur</span>
          <span class="text-primary text-2xl ml-1">●</span>
        </div>
        <button id="closeMenu" class="p-2">
          <i class="fa-solid fa-square-xmark text-gray-600 dark:text-gray-400 text-2xl "></i>
        </button>
      </div>
      <ul class="flex-1 flex flex-col justify-center items-center space-y-8">
        <li>
          <a href="#features" class="text-2xl text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Showcase</a>
        </li>
        <li>
          <a href="#about" class="text-2xl text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">about</a>
        </li>
        <li>
          <a href="#skills" class="text-2xl text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Skills</a>
        </li>
        <li>
          <a href="#projects" class="text-2xl text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Projects</a>
        </li>
        <li>
          <a href="#contact" class="text-2xl text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Contact</a>
        </li>
      </ul>
    </div>

  </div>

  <!-- Hero Section -->
  <section id="hero" class="min-h-screen flex items-center pt-20 pb-16 relative overflow-hidden">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          The <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">React Developer</span> For The Web
        </h1>
        <p class="text-xl md:text-2x text-gray-600 dark:text-gray-400 mb-8">Creating <strong>high-quality web applications</strong> with modern tools and best practices for exceptional user experiences.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a href="#projects" class="px-8 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-blue-300/30 dark:hover:shadow-blue-500/20 shadow-blue-200/20 dark:shadow-blue-700/10">View Projects
          </a>
          <a href="#about" class="px-8 py-3 bg-white dark:bg-dark-background-secondary text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-900 dark:hover:border-white transition-colors">Learn More</a>
        </div>
        <div class="bg-gray-100 dark:bg-dark-background-secondary rounded-lg overflow-hidden shadow-lg max-w-2xl mx-auto" id="terminal-container">
          <div class="flex items-center space-x-2 p-3 bg-gray-200 dark:bg-dark-background">
            <span class="w-3 h-3 rounded-full bg-red-500"></span>
            <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
          </div>
          <div class="p-6 font-mono terminal-content">
            <span class="text-green-500">$</span>
            <span class="command-text text-gray-900 dark:text-white"></span>

          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-24 bg-gray-50 dark:bg-dark-background-secondary translate-y-4 transition-all duration-500 opacity-0">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">What's in my Toolkit</h2>
      <p class="text-xl text-gray-600 dark:text-gray-400 text-center mb-16">
        Everything needed to build great products on the web.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Feature Card 1 -->
        <div class="bg-white dark:bg-dark-background p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 tranform hover:-translate-y-1">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <i class="fa-solid fa-paintbrush text-primary text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-4">Modern UI Design</h3>
          <p class="text-gray-600 dark:text-gray-400">Creating beautiful, responsive interfaces that look great on any device using the latest design trends.</p>
        </div>
        <!-- Feature Card 2 -->
        <div class="bg-white dark:bg-dark-background p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 tranform hover:-translate-y-1">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <i class="fa-solid fa-code text-primary text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-4">Clean code</h3>
          <p class="text-gray-600 dark:text-gray-400">Writing maintainable, efficient code following best practices and modern development standards.</p>
        </div>
        <!-- Feature Card 3 -->
        <div class="bg-white dark:bg-dark-background p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 tranform hover:-translate-y-1">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <i class="fa-solid fa-bolt text-primary text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-4">Performance Optimization</h3>
          <p class="text-gray-600 dark:text-gray-400">Ensuring fast load times and smooth expereinces through efficient code and asset optimiation.</p>
        </div>
        <!-- Feature Card 4 -->
        <div class="bg-white dark:bg-dark-background p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 tranform hover:-translate-y-1">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <i class="fa-solid fa-mobile-alt text-primary text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-4">Responsive Development</h3>
          <p class="text-gray-600 dark:text-gray-400">Building websites that work flawlessly across all screen sizes, from phone to large displays.</p>
        </div>
      </div>
    </div>

  </section>

  <!-- About Section -->

  <section id="about" class="py-24 translate-y-4 transition-all duration-500 opacity-0">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
          <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">
            I'm a frontend developer focused on crafting clean, user-friendly experiences.
          </p>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            I build responsive website that are fast, easy to use, and follow best coding practices. My expertise includes HTML, CSS, Javascript and moderm frameworks to create dynamic, engaging interfaces with clean optimized code.
          </p>
          <p class="text-gray-600 dark:text-gray-400 mb-8">When I'm not coding, you can find me exploring new technologies, contrubuting to open-souce projects, or enjoying a good book.</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="#contact" class="px-8 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-blue-300/30 dark:hover:shadow-blue-500/20 shadow-blue-200/20 dark:shadow-blue-700/10 text-center">Contact Me</a>
            <a href="#" class="px-8 py-3 bg-white dark:bg-dark-background-secondary text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-900 dark:hover:border-white transition-colors text-center">Download Resume</a>
          </div>
        </div>
        <div class="relative flex justify-center">
          <div class="flex w-3/4 h-3/4 justify-center max-auto animate-morph bg-gradient-to-br from-primary via-secondary to-accent rounded-full relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/50 via-secondary/50 to-accent/50 rounded-full blur-2xl animate-morph"></div>
            <div class="relative z-10 inline-block pt-11 lg:pt-0">
              <div class="pt-6 pl-6 pr-6 pb-0">
                <div class="avatar-container">
                  <img class="max-w-none" id="head" src="./assets/images/sprites/colin_avatar/Head/head_forward_1.png" alt="Avatar" />
                  <img class="avatar-layer" id="brows" src="./assets/images/sprites/colin_avatar/Brows/brows_neutral.png" alt="Avatar" />
                  <img class="avatar-layer" id="eyes" src="./assets/images/sprites/colin_avatar/Eyes/open_forward.png" alt="Avatar" />
                  <img class="avatar-layer" id="glasses" src="./assets/images/sprites/colin_avatar/Glasses/Glasses.png" alt="Avatar" />
                  <img class="avatar-layer" id="mouth" src="./assets/images/sprites/colin_avatar/Mouth/smile.png" alt="Avatar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>

  <!-- Skills Section -->

  <section id="skills" class="py-24 bg-gray-50 dark:bg-dark-background-secondary translate-y-4 transition-all duratio-500 opacity-0">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">My Skills</h2>
      <p class="text-xl text-gray-600 dark:text-gray-400 text-center mb-16">Technologies and tools I use to bring products to life.</p>


      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Skills Card 1 -->
        <div class="bg-white dark:bg-dark-background p-8 rounded-lg">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <i class="fa-brands fa-html5 text-red-500 text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-4">HTML5</h3>
          <div class="w-full h-2 bg-gray-200 dark:bg-white rounded-full overflow-hidden">
            <div class="w-[95%] h-full bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
        </div>
        <!-- Skills Card 2 -->
        <div class="bg-white dark:bg-dark-background p-8 rounded-lg">
          <div class="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <i class="fa-brands fa-css3 text-blue-500 text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-4">CSS3</h3>
          <div class="w-full h-2 bg-gray-200 dark:bg-white rounded-full overflow-hidden">
            <div class="w-[90%] h-full bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
        </div>
        <!-- Skills Card 3 -->
        <div class="bg-white dark:bg-dark-background p-8 rounded-lg">
          <div class="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6">
            <i class="fa-brands fa-js text-yellow-500 text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-4">JavaScript</h3>
          <div class="w-full h-2 bg-gray-200 dark:bg-white rounded-full overflow-hidden">
            <div class="w-[85%] h-full bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
        </div>
        <!-- Skills Card 4 -->
        <div class="bg-white dark:bg-dark-background p-8 rounded-lg">
          <div class="w-16 h-16 bg-blue-400/10 rounded-full flex items-center justify-center mb-6">
            <i class="fa-brands fa-react text-blue-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-4">React</h3>
          <div class="w-full h-2 bg-gray-200 dark:bg-white rounded-full overflow-hidden">
            <div class="w-[95%] h-full bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
        </div>
        <!-- Skills Card 5 -->
        <div class="bg-white dark:bg-dark-background p-8 rounded-lg">
          <div class="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
            <i class="fa-brands fa-git-alt text-orange-500 text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-4">Git</h3>
          <div class="w-full h-2 bg-gray-200 dark:bg-white rounded-full overflow-hidden">
            <div class="w-[85%] h-full bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
        </div>
        <!-- Skills Card 6 -->
        <div class="bg-white dark:bg-dark-background p-8 rounded-lg">
          <div class="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
            <i class="fa-brands fa-desktop text-purple-500 text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-4">Responsive Design</h3>
          <div class="w-full h-2 bg-gray-200 dark:bg-white rounded-full overflow-hidden">
            <div class="w-[85%] h-full bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- Projects Section -->

  <section id="projects" class="py-24 translate-y-4 transition-all duration-500 opacity-0">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">Featured Projects</h2>
      <p class="text-xl text-gray-600 dark:text-gray-400 text-center mb-16">
        Check out some of my recent work
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Project Card 1 -->
        <div class="bg-white dark:bg-dark-background rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="h-48 relative">
            <img src="./assets/images/design_ideas/about.jpg" alt="Crypto Platform" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/20"></div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-4">Cyrpto Platform</h3>
            <p class="text-gray-600 dark:text-gray-400">A modern cryptocurency tranding platform with real-time price tracking and portfolio management.</p>
            <div class="flex flex-wrap gap-2 my-6">
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">HTML5</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">CSS3</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">JavaScript</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">API</span>

            </div>
            <div class="flex gap-4">
              <a href="#" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">YouTube</a>
              <!-- For my portfolio, 👆 this will link to a 'live preview' of the page -->
              <a href="#" class="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"><i class="fa-brands fa-github mr-2"></i>Code</a>
            </div>
          </div>
        </div>
        <!-- Project Card 2 -->
        <div class="bg-white dark:bg-dark-background rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="h-48 relative">
            <img src="./assets/images/design_ideas/avatar_all.png" alt="AI Landing Page" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/20"></div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-4">AI Landing Page</h3>
            <p class="text-gray-600 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id massa eros. Donec et rutrum elit.</p>
            <div class="flex flex-wrap gap-2 my-6">
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">HTML5</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">CSS3</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">JavaScript</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">API</span>

            </div>
            <div class="flex gap-4">
              <a href="#" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">YouTube</a>
              <!-- For my portfolio, 👆 this will link to a 'live preview' of the page -->
              <a href="#" class="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"><i class="fa-brands fa-github mr-2"></i>Code</a>
            </div>
          </div>
        </div>
        <!-- Project Card 3 -->
        <div class="bg-white dark:bg-dark-background rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="h-48 relative">
            <img src="./assets/images/design_ideas/cartridge.png" alt="AI Image Detector" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/20"></div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-4">AI Image Detector</h3>
            <p class="text-gray-600 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id massa eros. Donec et rutrum elit</p>
            <div class="flex flex-wrap gap-2 my-6">
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">HTML5</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">CSS3</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">JavaScript</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-dark-background-secondary text-gray-600 dark:text-gray-400 rounded-full text-sm">API</span>

            </div>
            <div class="flex gap-4">
              <a href="#" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">YouTube</a>
              <!-- For my portfolio, 👆 this will link to a 'live preview' of the page -->
              <a href="#" class="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"><i class="fa-brands fa-github mr-2"></i>Code</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="py-24 bg-gray-50 dark:bg-dark-background-secondary translate-y-4 transition-all duration-500 opacity-0">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-4">Get In Touch</h2>
      <p class="text-xl text-gray-600 dark:text-gray-400 text-center">
        Interered in working together? Let's connect.
      </p>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Contact Info -->
        <div class="lg:col-span-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
          <!-- Email -->
          <div class="bg-white dark:bg-dark-background p-6 rounded-lg shadow-lg text-center">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-envelope text-primary text-xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">Email</h3>
            <p class="text-gray-600 dark:text-gray-400">example@test.com</p>
          </div>
          <!-- Location -->
          <div class="bg-white dark:bg-dark-background p-6 rounded-lg shadow-lg text-center">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-map-location-dot text-primary text-xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">Location</h3>
            <p class="text-gray-600 dark:text-gray-400">Over Here</p>
          </div>
          <!-- Social -->
          <div class="bg-white dark:bg-dark-background p-6 rounded-lg shadow-lg text-center">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-globe text-primary text-xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">Social</h3>
            <div class="flex justify-center space-x-4">
              <a href="#" class="w-10 h-10 bg-gray-100 dark:bg-dark-background-secondary rounded-full flex items-center justify-center text-gray-600 hover:text-primary dark:hover:text-primary dark:text-gray-400 transition-all duration-300">
                <i class="fa-brands fa-github"></i>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-100 dark:bg-dark-background-secondary rounded-full flex items-center justify-center text-gray-600 hover:text-primary dark:hover:text-primary dark:text-gray-400 transition-all duration-300">
                <i class="fa-brands fa-linkedin"></i>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-100 dark:bg-dark-background-secondary rounded-full flex items-center justify-center text-gray-600 hover:text-primary dark:hover:text-primary dark:text-gray-400 transition-all duration-300">
                <i class="fa-brands fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <form id="contactForm" action="" class="flex flex-col gap-6 bg-white dark:bg-dark-background p-8 rounded-lg shadow-lg">
            <h3 class="text-2xl font-bold">Send me a message</h3>
            <div class="space-y-6">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" name="name" id="name" required class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-background-secondary text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors outline-none">
            </div>
            <div class="space-y-6">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" name="email" id="email" required class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-background-secondary text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors outline-none">
            </div>
            <div class="space-y-6">
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea type="text" name="message" id="message" rows="5" required class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-background-secondary text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors outline-none"></textarea>
            </div>
            <button type="submit" class="w-full px-8 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-blue-300/30 dark:hover:shadow-blue-500/20 shadow-blue-200/20 dark:shadow-blue-700/10">Send Message</button>
          </form>
        </div>
      </div>
  </section>
  <!-- Footer -->
  <footer class="bg-gray-50 dark:bg-dark-background py-12">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <div class="flex items-center mb-4 md:mb-0">
          <span class="text-xl font-extrabold">Colin McArthur</span>
          <span class="text-primary text-2xl ml-1">●</span>
        </div>
        <ul class="flex flex-wrap justify-center gap-6 mb-0">
          <li>
            <a href="#features" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hoverLtext-primary transition-colors">Showcase</a>
          </li>
          <li>
            <a href="#about" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hoverLtext-primary transition-colors">About</a>
          </li>
          <li>
            <a href="#skills" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hoverLtext-primary transition-colors">Skills</a>
          </li>
          <li>
            <a href="#projects" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hoverLtext-primary transition-colors">Projects</a>
          </li>
          <li>
            <a href="#contact" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hoverLtext-primary transition-colors">Contact</a>
          </li>


        </ul>
        <div class="flex gap-4">
          <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
            <i class="fa-brands fa-github"></i>
          </a>
          <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
            <i class="fa-brands fa-linkedin"></i>
          </a>
          <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
            <i class="fa-brands fa-twitter"></i>
          </a>
        </div>
      </div>
      <div class="text-center text-gray-60 dark:text-gray-400 text-sm">
        <p>&copy; 2025 Colin McArthur Portfio. All rights reserved</p>
      </div>
    </div>
  </footer>
  <script src=" ../public/assets/js/expressions.js"></script>
  <script src=" ../public/assets/js/scripts.js"></script>
</body>

</html>