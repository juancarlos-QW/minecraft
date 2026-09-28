// ==================================================
// BOTÃO — independente das bibliotecas e das cenas 3D
// ==================================================

const botaoVoltarTopo = document.getElementById("voltarTopo");

botaoVoltarTopo?.addEventListener("click", () => {
  const reduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: reduzirMovimento ? "instant" : "smooth",
  });
});

// ==================================================
// INICIALIZAÇÃO
// ==================================================

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const temAnimacoes = Boolean(gsap && ScrollTrigger);

if (temAnimacoes) {
  gsap.registerPlugin(ScrollTrigger);

  try {
    iniciarAnimacoesPagina();
  } catch (erro) {
    console.warn("Falha nas animações da página:", erro);
  }
}

function mostrarFalhaSteve() {
  const container = document.getElementById("steveContainer");

  if (!container) return;

  let aviso = container.querySelector(".steve-loading");

  if (!aviso) {
    aviso = document.createElement("div");
    aviso.className = "steve-loading";
    container.appendChild(aviso);
  }

  aviso.textContent = "Visualização 3D indisponível neste navegador.";
  aviso.setAttribute("role", "status");

  const dica = document.querySelector(".section3-dica");

  if (dica) dica.hidden = true;
}

// As bibliotecas 3D são carregadas separadamente.

async function iniciarModelos() {
  if (!temAnimacoes) {
    mostrarFalhaSteve();
    return;
  }

  let THREE;
  let GLTFLoader;

  try {
    const modulos = await Promise.all([
      import("three"),
      import("three/addons/loaders/GLTFLoader.js"),
    ]);

    THREE = modulos[0];
    GLTFLoader = modulos[1].GLTFLoader;
  } catch (erro) {
    console.warn("Não foi possível carregar as bibliotecas 3D:", erro);
    mostrarFalhaSteve();
    return;
  }

  // Uma falha na abelha não impede a inicialização do Steve.
  try {
    iniciarAbelha(THREE, GLTFLoader);
  } catch (erro) {
    console.warn("Cena da abelha indisponível:", erro);
  }

  try {
    iniciarSteve(THREE, GLTFLoader);
  } catch (erro) {
    console.warn("Cena do Steve indisponível:", erro);
    mostrarFalhaSteve();
  }
}

iniciarModelos();

// ==================================================
// ANIMAÇÕES DA PÁGINA — independentes das cenas 3D
// ==================================================

function iniciarAnimacoesPagina() {
  const progresso = document.createElement("div");

  progresso.className = "scroll-progress";
  progresso.setAttribute("aria-hidden", "true");

  document.body.appendChild(progresso);

  const animacoesPagina = gsap.matchMedia();

  animacoesPagina.add(
    {
      desktop: "(min-width: 901px)",
      mobile: "(max-width: 900px)",
      reduzir: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { desktop, reduzir } = context.conditions;

      if (reduzir) return;

      const distancia = desktop ? 160 : 45;

      // Barra de progresso
      gsap.to(progresso, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".container",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
        },
      });

      // Entrada do hero
      const entradaHero = gsap.timeline({
        defaults: {
          duration: 1.1,
          ease: "power3.out",
        },
      });

      entradaHero
        .from(".section1 .section-content", {
          y: 24,
          autoAlpha: 0,
        })
        .from(
          ".hero-word",
          {
            y: 65,
            rotationX: -25,
            autoAlpha: 0,
            stagger: 0.18,
          },
          "-=0.7"
        );

      // Saída do título durante a rolagem
      gsap.to(".section1 h1", {
        y: desktop ? -110 : -50,
        scale: 0.88,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".section1",
          start: "top top",
          end: "bottom 30%",
          scrub: 1,
        },
      });

      // Textos da segunda seção
      gsap.utils.toArray(".section2 h2").forEach((titulo, index) => {
        gsap.fromTo(
          titulo,
          {
            x: index % 2 === 0 ? distancia : -distancia,
            y: 25,
            autoAlpha: 0,
            rotation: index % 2 === 0 ? 3 : -3,
            filter: desktop ? "blur(8px)" : "blur(0px)",
          },
          {
            x: 0,
            y: 0,
            autoAlpha: 1,
            rotation: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: titulo,
              start: "top 95%",
              end: "top 62%",
              scrub: 0.8,
            },
          }
        );
      });

      // Textos da terceira seção
      const entradaSteve = gsap.timeline({
        defaults: {
          duration: 0.85,
          ease: "power3.out",
        },
        scrollTrigger: {
          trigger: ".section3",
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      entradaSteve
        .from(".section3-overlay .section-content", {
          x: -distancia,
          autoAlpha: 0,
        })
        .from(
          ".section3-overlay h2",
          {
            x: distancia,
            autoAlpha: 0,
            filter: desktop ? "blur(8px)" : "blur(0px)",
          },
          "-=0.55"
        )
        .from(
          ".section3-dica",
          {
            y: 15,
            autoAlpha: 0,
          },
          "-=0.3"
        );

      // Revelação do container do Steve
      gsap.fromTo(
        "#steveContainer",
        {
          opacity: 0,
          y: 65,
        },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".section3",
            start: "top 85%",
            end: "top 25%",
            scrub: 1,
          },
        }
      );
    }
  );

  document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
  });
}

// ==================================================
// CENA 1 — ABELHA
// ==================================================

function iniciarAbelha(THREE, GLTFLoader) {
  const cenaAbelha = new THREE.Scene();

  const cameraAbelha = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  cameraAbelha.position.z = 12;

  const renderAbelha = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderAbelha.setSize(window.innerWidth, window.innerHeight);
  renderAbelha.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  document.querySelector(".abelha").appendChild(renderAbelha.domElement);

  cenaAbelha.add(new THREE.AmbientLight("white", 0.8));

  const luzDirAbelha = new THREE.DirectionalLight("white", 2);

  luzDirAbelha.position.set(-3, 2, 3);
  cenaAbelha.add(luzDirAbelha);

  let abelha;
  let mixerAbelha;

  const timerAbelha = new THREE.Timer();
  const loader = new GLTFLoader();

  loader.load(
    "assets/bee.glb",
    (obj) => {
      abelha = obj.scene;
      mixerAbelha = new THREE.AnimationMixer(abelha);

      if (obj.animations.length) {
        mixerAbelha.clipAction(obj.animations[0]).play();
      }

      cenaAbelha.add(abelha);

      abelha.position.set(10, 0, -19);
      abelha.rotation.y = 2.6;
      abelha.rotation.x = -0.5;

      gsap.to(abelha.position, {
        x: -10,
        scrollTrigger: {
          trigger: ".divAbelha",
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });

      gsap.to(abelha.rotation, {
        y: 3.5,
        scrollTrigger: {
          trigger: ".divAbelha",
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });
    },
    undefined,
    (erro) => {
      console.warn("Não foi possível carregar a abelha:", erro);
    }
  );

  window.addEventListener("resize", () => {
    cameraAbelha.aspect = window.innerWidth / window.innerHeight;
    cameraAbelha.updateProjectionMatrix();

    renderAbelha.setSize(window.innerWidth, window.innerHeight);
  });

  function animarAbelha() {
    timerAbelha.update();

    const delta = timerAbelha.getDelta();

    if (mixerAbelha) {
      mixerAbelha.update(delta);
    }

    requestAnimationFrame(animarAbelha);
    renderAbelha.render(cenaAbelha, cameraAbelha);
  }

  animarAbelha();
}

// ==================================================
// CENA 2 — STEVE
// ==================================================

function iniciarSteve(THREE, GLTFLoader) {
  const loader = new GLTFLoader();
  const container = document.getElementById("steveContainer");

  const loading = document.createElement("div");

  loading.className = "steve-loading";
  loading.textContent = "Carregando Steve...";

  container.appendChild(loading);

  const cenaSteve = new THREE.Scene();

  const cameraSteve = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.01,
    100
  );

  const renderSteve = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderSteve.setSize(
    container.clientWidth || window.innerWidth,
    container.clientHeight || window.innerHeight
  );

  renderSteve.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderSteve.shadowMap.enabled = true;
  renderSteve.shadowMap.type = THREE.PCFShadowMap;

  container.appendChild(renderSteve.domElement);

  // Iluminação
  cenaSteve.add(new THREE.AmbientLight("white", 0.4));

  const luzPrincipal = new THREE.DirectionalLight("#ffffff", 3);

  luzPrincipal.position.set(2, 4, 4);
  luzPrincipal.castShadow = true;

  cenaSteve.add(luzPrincipal);

  const luzPreenchimento = new THREE.DirectionalLight("#88aaff", 1.2);

  luzPreenchimento.position.set(-3, 2, 1);
  cenaSteve.add(luzPreenchimento);

  const luzRima = new THREE.DirectionalLight("#ffaa44", 0.8);

  luzRima.position.set(0, 3, -4);
  cenaSteve.add(luzRima);

  const luzBaixo = new THREE.DirectionalLight("#334466", 0.4);

  luzBaixo.position.set(0, -3, 2);
  cenaSteve.add(luzBaixo);

  // Interação
  const mouse = { x: 0, y: 0 };
  const alvo = { x: 0, y: 0 };

  const section3 = document.querySelector(".section3");

  section3.addEventListener("mousemove", (e) => {
    const rect = section3.getBoundingClientRect();

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  section3.addEventListener("mouseleave", () => {
    mouse.x = 0;
    mouse.y = 0;
  });

  // Evento passivo: permite a rolagem no celular.
  section3.addEventListener(
    "touchmove",
    (e) => {
      const touch = e.touches[0];

      if (!touch) return;

      const rect = section3.getBoundingClientRect();

      mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    },
    { passive: true }
  );

  section3.addEventListener("touchend", () => {
    mouse.x = 0;
    mouse.y = 0;
  });

  section3.addEventListener("touchcancel", () => {
    mouse.x = 0;
    mouse.y = 0;
  });

  // Carregamento do modelo
  let steve = null;
  let cabeca = null;
  let torso = null;
  let bracoDireito = null;
  let bracoEsquerdo = null;

  loader.load(
    "assets/steve.glb",
    (obj) => {
      steve = obj.scene;
      cenaSteve.add(steve);

      const box = new THREE.Box3().setFromObject(steve);
      const altura = box.max.y - box.min.y;
      const centro = box.getCenter(new THREE.Vector3());

      const escala = 2.5 / altura;

      steve.scale.setScalar(escala);

      steve.position.set(
        -centro.x * escala,
        -box.min.y * escala,
        -centro.z * escala
      );

      // Mantém o enquadramento original.
      const alturaEscalada = altura * escala;
      const foco = alturaEscalada * 0.92;

      cameraSteve.position.set(0, foco, 1.2);
      cameraSteve.lookAt(0, foco, 0);

      // Identifica as partes disponíveis no modelo.
      steve.traverse((filho) => {
        const n = filho.name.toLowerCase();

        if (
          n.includes("head") ||
          n.includes("helmet") ||
          n.includes("cabeca")
        ) {
          cabeca = filho;
        }

        if (
          n.includes("body") ||
          n.includes("torso") ||
          n.includes("chest")
        ) {
          torso = filho;
        }

        if (
          n.includes("rightarm") ||
          n.includes("arm_r") ||
          (n.includes("arm") && n.includes("right"))
        ) {
          bracoDireito = filho;
        }

        if (
          n.includes("leftarm") ||
          n.includes("arm_l") ||
          (n.includes("arm") && n.includes("left"))
        ) {
          bracoEsquerdo = filho;
        }
      });

      // Entrada
      steve.scale.setScalar(0);

      gsap.to(steve.scale, {
        x: escala,
        y: escala,
        z: escala,
        duration: 1.2,
        ease: "back.out(1.5)",
        delay: 0.2,
      });

      // Respiração
      gsap.to(steve.position, {
        y: steve.position.y + 0.04,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      loading.remove();
    },
    (progress) => {
      if (progress.total > 0) {
        const pct = Math.round(
          (progress.loaded / progress.total) * 100
        );

        loading.textContent = `Carregando Steve... ${pct}%`;
      }
    },
    (erro) => {
      console.error("Erro ao carregar Steve:", erro);

      loading.textContent =
        "Erro ao carregar — verifique o nome do arquivo .glb";
    }
  );

  // Ajusta o renderizador quando o container muda de tamanho.
  const resizeObs = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;

    if (!w || !h) return;

    cameraSteve.aspect = w / h;
    cameraSteve.updateProjectionMatrix();

    renderSteve.setSize(w, h);
  });

  resizeObs.observe(container);

  function animarSteve() {
    requestAnimationFrame(animarSteve);

    // Suavização do movimento
    alvo.x += (mouse.x - alvo.x) * 0.05;
    alvo.y += (mouse.y - alvo.y) * 0.05;

    if (steve) {
      steve.rotation.y = alvo.x * 0.5;
      steve.rotation.x = -alvo.y * 0.12;

      if (cabeca) {
        cabeca.rotation.y = alvo.x * 0.45;
        cabeca.rotation.x = -alvo.y * 0.35;
      }

      if (torso) {
        torso.rotation.y = alvo.x * 0.2;
        torso.rotation.x = -alvo.y * 0.08;
      }

      if (bracoDireito) {
        bracoDireito.rotation.x = alvo.y * 0.6 - 0.15;
        bracoDireito.rotation.z = alvo.x * 0.1;
      }

      if (bracoEsquerdo) {
        bracoEsquerdo.rotation.x = -alvo.y * 0.4;
        bracoEsquerdo.rotation.z = -alvo.x * 0.1;
      }
    }

    renderSteve.render(cenaSteve, cameraSteve);
  }

  animarSteve();
}