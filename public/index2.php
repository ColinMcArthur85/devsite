<!doctype html>
<html lang="en" class="scroll-smooth">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Colin McArthur Website</title>
  <link rel="stylesheet" href="./assets/css/style.css" />

</head>

<body>
  <!-- Site Menu -->
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/50">
    <?php include_once __DIR__ . '/../src/includes/header.php'; ?>
  </header>
  <!-- Hero Section -->

  <div class="relative bg-primary-blue pb-[110px] pt-[120px] lg:pt-[150px] dark:bg-dark ">
    <div class="custom-container">
      <div class="-mx-4 flex flex-wrap items-center">
        <div class="w-full px-4 lg:w-5/12">
          <div class="hero-content">
            <h1
              class="mb-5 text-4xl font-bold leading-[1.208]! text-dark sm:text-[42px] lg:text-[40px] xl:text-5xl dark:text-white">
              Hi, I'm Colin - I build, tinker and tell stories in {code}.
            </h1>
            <p
              class="mb-8 max-w-[480px] text-base text-primary-red dark:text-dark-6">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae repudiandae magni, obcaecati labore dicta odit nemo voluptates consequatur modi ipsa doloremque rem ipsum error eos quas reiciendis, ad reprehenderit eaque!
            </p>
            <ul class="flex flex-wrap items-center">
              <li>
                <button
                  href="javascript:void(0)" class="btn-primary">
                  Get Started
                </button>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="inline-flex items-center justify-center px-5 py-3 text-center text-base font-medium text-[#464646] hover:text-primary dark:text-white">
                  <span class="mr-2">
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12.6152" r="12" fill="#3758F9" />
                      <rect
                        x="7.99893"
                        y="14.979"
                        width="8.18182"
                        height="1.63636"
                        fill="white" />
                      <rect
                        x="11.2717"
                        y="7.61523"
                        width="1.63636"
                        height="4.09091"
                        fill="white" />
                      <path
                        d="M12.0898 14.1606L14.9241 11.0925H9.25557L12.0898 14.1606Z"
                        fill="white" />
                    </svg>
                  </span>
                  Download App
                </a>
              </li>
            </ul>
            <div class="clients pt-16">
              <h6
                class="mb-6 flex items-center text-xs font-normal text-white dark:text-dark-6">
                Some Of Our Clients
                <span class="ml-3 inline-block h-px w-8 bg-body-color"></span>
              </h6>
              <div class="flex items-center gap-4 xl:gap-[50px]">
                <a href="javascript:void(0)" class="block py-3">
                  <img
                    src="./assets/images/brands/oracle.svg"
                    alt="oracle" />
                </a>
                <a href="javascript:void(0)" class="block py-3">
                  <img
                    src="./assets/images/brands/intel.svg"
                    alt="intel" />
                </a>
                <a href="javascript:void(0)" class="block py-3">
                  <img
                    src="./assets/images/brands/logitech.svg"
                    alt="logitech" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="hidden px-4 lg:block lg:w-1/12"></div>
        <div class="w-full px-4 lg:w-6/12">
          <div class="lg:ml-auto lg:text-right">
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
              <!-- <img
                src="./assets/images/hero/hero-image-01.png"
                alt="hero"
                class="max-w-full lg:ml-auto" /> -->
              <span class="absolute -bottom-8 -left-8 z-[-1]">
                <svg
                  width="93"
                  height="93"
                  viewBox="0 0 93 93"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <circle cx="2.5" cy="2.5" r="2.5" fill="#3056D3" />
                  <circle cx="2.5" cy="24.5" r="2.5" fill="#3056D3" />
                  <circle cx="2.5" cy="46.5" r="2.5" fill="#3056D3" />
                  <circle cx="2.5" cy="68.5" r="2.5" fill="#3056D3" />
                  <circle cx="2.5" cy="90.5" r="2.5" fill="#3056D3" />
                  <circle cx="24.5" cy="2.5" r="2.5" fill="#3056D3" />
                  <circle cx="24.5" cy="24.5" r="2.5" fill="#3056D3" />
                  <circle cx="24.5" cy="46.5" r="2.5" fill="#3056D3" />
                  <circle cx="24.5" cy="68.5" r="2.5" fill="#3056D3" />
                  <circle cx="24.5" cy="90.5" r="2.5" fill="#3056D3" />
                  <circle cx="46.5" cy="2.5" r="2.5" fill="#3056D3" />
                  <circle cx="46.5" cy="24.5" r="2.5" fill="#3056D3" />
                  <circle cx="46.5" cy="46.5" r="2.5" fill="#3056D3" />
                  <circle cx="46.5" cy="68.5" r="2.5" fill="#3056D3" />
                  <circle cx="46.5" cy="90.5" r="2.5" fill="#3056D3" />
                  <circle cx="68.5" cy="2.5" r="2.5" fill="#3056D3" />
                  <circle cx="68.5" cy="24.5" r="2.5" fill="#3056D3" />
                  <circle cx="68.5" cy="46.5" r="2.5" fill="#3056D3" />
                  <circle cx="68.5" cy="68.5" r="2.5" fill="#3056D3" />
                  <circle cx="68.5" cy="90.5" r="2.5" fill="#3056D3" />
                  <circle cx="90.5" cy="2.5" r="2.5" fill="#3056D3" />
                  <circle cx="90.5" cy="24.5" r="2.5" fill="#3056D3" />
                  <circle cx="90.5" cy="46.5" r="2.5" fill="#3056D3" />
                  <circle cx="90.5" cy="68.5" r="2.5" fill="#3056D3" />
                  <circle cx="90.5" cy="90.5" r="2.5" fill="#3056D3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <section class="u-flex-center bg-primary-blue">
    <div class="u-flex-center flex-col max-w-6xl md:flex-row">
      <div class="pt-6 pl-6 pr-6 pb-0">
        <div class="avatar-container">
          <img class="max-w-none" id="head" src="./assets/img/sprites/colin_avatar/Head/head_forward_1.png" alt="Avatar" />
          <img class="avatar-layer" id="brows" src="./assets/img/sprites/colin_avatar/Brows/brows_neutral.png" alt="Avatar" />
          <img class="avatar-layer" id="eyes" src="./assets/img/sprites/colin_avatar/Eyes/open_forward.png" alt="Avatar" />
          <img class="avatar-layer" id="glasses" src="./assets/img/sprites/colin_avatar/Glasses/Glasses.png" alt="Avatar" />
          <img class="avatar-layer" id="mouth" src="./assets/img/sprites/colin_avatar/Mouth/smile.png" alt="Avatar" />
        </div>
      </div>
      <div class="p-6">
        <h1 class="text-5xl font-bold text-primary-yellow">
          Hi, I'm Colin - I build, tinker and tell stories in {code}.
        </h1>
        <p class="text-primary-red">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae repudiandae magni, obcaecati labore dicta odit nemo voluptates consequatur modi ipsa doloremque rem ipsum error eos quas reiciendis, ad reprehenderit eaque!</p>
      </div>
    </div>
  </section> -->

  <!-- Main Content -->
  <main class="flex-auto">
    <section id="projects" class="bg-white px-6 py-24 sm:px-12 lg:px-24 dark:bg-zinc-900">
      <div class="mx-auto max-w-6xl text-center">
        <h2 class="mb-6 text-3xl font-bold text-zinc-900 dark:text-white">Featured Projects</h2>
        <p class="mb-12 text-zinc-600 dark:text-zinc-400">A collection of recent apps, scripts, and tools I’ve built using JavaScript, PHP, and Python.</p>

        <div class="grid gap-8 md:grid-cols-2">
          <div class="rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
            <h3 class="text-lg font-semibold text-zinc-800 dark:text-white">AI-Powered Website Builder</h3>
            <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">A tool that uses LLMs to generate custom HTML/CSS layouts based on user prompts and screenshots.</p>
          </div>
          <div class="rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
            <h3 class="text-lg font-semibold text-zinc-800 dark:text-white">Custom Mail Server Automation</h3>
            <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Automates SPF, DKIM, DMARC, and MX setup across domains using Mailgun and Liquid Web APIs.</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- <div class="fixed bottom-0 left-0 z-50 w-full bg-gray-900 px-6 py-4 sm:px-12 lg:px-24">
    <div class="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_2fr]">
      <div class="flex flex-col justify-between rounded-2xl bg-gray-800 p-6">
        <div class="avatar-container">
          <img class="avatar-layer" id="head" src="./assets/img/sprites/colin_avatar/Head/head_forward.png" alt="Avatar" />
          <img class="avatar-layer" id="brows" src="./assets/img/sprites/colin_avatar/Brows/brows_neutral.png" alt="Avatar" />
          <img class="avatar-layer" id="eyes" src="./assets/img/sprites/colin_avatar/Eyes/open_forward.png" alt="Avatar" />
          <img class="avatar-layer" id="glasses" src="./assets/img/sprites/colin_avatar/Glasses/Glasses.png" alt="Avatar" />
          <img class="avatar-layer" id="mouth" src="./assets/img/sprites/colin_avatar/Mouth/smile.png" alt="Avatar" />
        </div>
      </div>

      <div class="flex flex-col justify-between rounded-2xl bg-gray-800 p-6">
        <div>
          <h3 class="mb-1 text-lg font-semibold text-white">Secondary Tile A</h3>
          <p class="text-sm text-gray-400">This right-hand tile stretches to match the height of the left column.</p>
        </div>
        <div class="mt-4">
          <a href="#" class="text-sm font-medium text-indigo-400 hover:text-indigo-300">Read More →</a>
        </div>
      </div>
    </div>
  </div> -->

  <script src="../public/assets/js/expressions.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>
</body>

</html>