import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════════════════════════
//  CENA 1 — ABELHA (scroll)
// ════════════════════════════════════════════════

const cenaAbelha = new THREE.Scene();

const cameraAbelha = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
cameraAbelha.position.z = 12;

const renderAbelha = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderAbelha.setSize(window.innerWidth, window.innerHeight);
renderAbelha.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.querySelector(".abelha").appendChild(renderAbelha.domElement);

cenaAbelha.add(new THREE.AmbientLight("white", 0.8));
const luzDirAbelha = new THREE.DirectionalLight("white", 2);
luzDirAbelha.position.set(-3, 2, 3);
cenaAbelha.add(luzDirAbelha);

let abelha, mixerAbelha;
const timerAbelha = new THREE.Timer();
const loader = new GLTFLoader();

loader.load("assets/bee.glb", (obj) => {
  abelha = obj.scene;
  mixerAbelha = new THREE.AnimationMixer(abelha);
  mixerAbelha.clipAction(obj.animations[0]).play();
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
});

window.addEventListener("resize", () => {
  cameraAbelha.aspect = window.innerWidth / window.innerHeight;
  cameraAbelha.updateProjectionMatrix();
  renderAbelha.setSize(window.innerWidth, window.innerHeight);
});

function animarAbelha() {
  timerAbelha.update();
  const delta = timerAbelha.getDelta();
  if (mixerAbelha) mixerAbelha.update(delta);
  requestAnimationFrame(animarAbelha);
  renderAbelha.render(cenaAbelha, cameraAbelha);
}
animarAbelha();


// ════════════════════════════════════════════════
//  CENA 2 — STEVE (busto grande, reage ao mouse)
// ════════════════════════════════════════════════

const container = document.getElementById("steveContainer");

// Loading
const loading = document.createElement("div");
loading.className = "steve-loading";
loading.textContent = "Carregando Steve...";
container.appendChild(loading);

// Cena
const cenaSteve = new THREE.Scene();

// FOV 75 — mais dramático, efeito busto grande
const cameraSteve = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.01,
  100
);

// Renderizador
const renderSteve = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderSteve.setSize(
  container.clientWidth  || window.innerWidth,
  container.clientHeight || window.innerHeight
);

renderSteve.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderSteve.shadowMap.enabled = true;
renderSteve.shadowMap.type = THREE.PCFShadowMap;
container.appendChild(renderSteve.domElement);

// ── Iluminação cinematográfica ──
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

// ── Mouse tracking ──
const mouse = { x: 0, y: 0 };
const alvo  = { x: 0, y: 0 };

const section3 = document.querySelector(".section3");

section3.addEventListener("mousemove", (e) => {
  const rect = section3.getBoundingClientRect();
  mouse.x =  ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
  mouse.y = -((e.clientY - rect.top)   / rect.height) * 2 + 1;
});

section3.addEventListener("mouseleave", () => {
  mouse.x = 0;
  mouse.y = 0;
});

section3.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect  = section3.getBoundingClientRect();
  mouse.x =  ((touch.clientX - rect.left)  / rect.width)  * 2 - 1;
  mouse.y = -((touch.clientY - rect.top)   / rect.height) * 2 + 1;
}, { passive: false });

section3.addEventListener("touchend", () => {
  mouse.x = 0;
  mouse.y = 0;
});

// ── Carregar Steve ──
let steve         = null;
let cabeca        = null;
let torso         = null;
let bracoDireito  = null;
let bracoEsquerdo = null;

loader.load(
  "assets/steve.glb", // ← nome exato do arquivo na pasta assets
  (obj) => {
    steve = obj.scene;
    cenaSteve.add(steve);

    // Bounding box para calcular tamanho real
    const box    = new THREE.Box3().setFromObject(steve);
    const altura = box.max.y - box.min.y;
    const centro = box.getCenter(new THREE.Vector3());

    // Escala grande — Steve ocupa bastante tela
    const escala = 2.5 / altura;
    steve.scale.setScalar(escala);

    // Centraliza e coloca pé no Y=0
    steve.position.set(
      -centro.x * escala,
      -box.min.y * escala,
      -centro.z * escala
    );

    // Câmera focada na cabeça e torso
    const alturaEscalada = altura * escala;
    const foco = alturaEscalada * 0.92; // região cabeça/pescoço/ombros

    // z: 0.5 = câmera bem próxima = Steve bem grande na tela
    cameraSteve.position.set(0, foco, 1.2);
    cameraSteve.lookAt(0, foco, 0);

    // Identifica partes do modelo
    steve.traverse((filho) => {
      const n = filho.name.toLowerCase();
      if (n.includes("head") || n.includes("helmet") || n.includes("cabeca")) {
        cabeca = filho;
      }
      if (n.includes("body") || n.includes("torso") || n.includes("chest") || n === "body") {
        torso = filho;
      }
      if (n.includes("rightarm") || n.includes("arm_r") || (n.includes("arm") && n.includes("right"))) {
        bracoDireito = filho;
      }
      if (n.includes("leftarm") || n.includes("arm_l") || (n.includes("arm") && n.includes("left"))) {
        bracoEsquerdo = filho;
      }
    });

    // Animação de entrada
    steve.scale.setScalar(0);
    gsap.to(steve.scale, {
      x: escala, y: escala, z: escala,
      duration: 1.2,
      ease: "back.out(1.5)",
      delay: 0.2,
    });

    // Respiração idle
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
      const pct = Math.round((progress.loaded / progress.total) * 100);
      loading.textContent = `Carregando Steve... ${pct}%`;
    }
  },

  (erro) => {
    console.error("Erro ao carregar Steve:", erro);
    loading.textContent = "Erro ao carregar — verifique o nome do arquivo .glb";
  }
);

// ── Resize ──
const resizeObs = new ResizeObserver(() => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (!w || !h) return;
  cameraSteve.aspect = w / h;
  cameraSteve.updateProjectionMatrix();
  renderSteve.setSize(w, h);
});
resizeObs.observe(container);

// ── Loop Steve ──
function animarSteve() {
  requestAnimationFrame(animarSteve);

  // Lerp suave
  alvo.x += (mouse.x - alvo.x) * 0.05;
  alvo.y += (mouse.y - alvo.y) * 0.05;

  if (steve) {
    // Corpo inteiro rotaciona com o mouse
    steve.rotation.y = alvo.x * 0.5;
    steve.rotation.x = -alvo.y * 0.12;

    // Cabeça: mais expressiva
    if (cabeca) {
      cabeca.rotation.y = alvo.x * 0.45;
      cabeca.rotation.x = -alvo.y * 0.35;
    }

    // Torso: mais sutil
    if (torso) {
      torso.rotation.y = alvo.x * 0.2;
      torso.rotation.x = -alvo.y * 0.08;
    }

    // Braço direito
    if (bracoDireito) {
      bracoDireito.rotation.x = alvo.y * 0.6 - 0.15;
      bracoDireito.rotation.z = alvo.x * 0.1;
    }

    // Braço esquerdo
    if (bracoEsquerdo) {
      bracoEsquerdo.rotation.x = -alvo.y * 0.4;
      bracoEsquerdo.rotation.z = -alvo.x * 0.1;
    }
  }

  renderSteve.render(cenaSteve, cameraSteve);
}


// ═══════════════════════════════════════════
// ANIMAÇÕES DA LANDING PAGE
// ═══════════════════════════════════════════

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

    // Mantém o conteúdo visível sem as novas animações.
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

    // 1. Entrada inicial: frase e palavras em sequência.
    // Os spans recebem a entrada; o h1 recebe a saída no scroll.
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

    // 2. Título se afasta ao sair da primeira seção.
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

    // 3. Títulos entram de lados alternados.
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

    // 4. Entrada em sequência do conteúdo da Mojang.
    const entradaMojang = gsap.timeline({
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

    entradaMojang
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

    // 5. Revela o canvas sem alterar as rotações do modelo.
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

// Recalcula as posições quando a fonte terminar de carregar.
document.fonts.ready.then(() => {
  ScrollTrigger.refresh();
});


animarSteve();