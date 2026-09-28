# 🌍 Minecraft World — Landing Page 3D

## 🌐 Projeto online

[🚀 Clique aqui para acessar o Minecraft World](https://juancarlos-qw.github.io/minecraft/)

## 📸 Prévia do projeto <img width="1901" height="1215" alt="Captura de tela_28-9-2026_62649_127 0 0 1" src="https://github.com/user-attachments/assets/2e754f29-8855-43cd-a371-189429707827" />



Landing page inspirada no universo de Minecraft, criada para explorar animações de rolagem, modelos 3D e interações com JavaScript.

O projeto combina cenários do jogo, tipografia temática e movimentos que acompanham a navegação para criar uma experiência visual imersiva.

## ✨ Funcionalidades

- **Abelha em 3D:** animação do modelo e deslocamento controlado pela rolagem.
- **Título animado:** entrada em sequência e efeito de afastamento ao sair da primeira seção.
- **Textos com movimento:** aparecem por lados alternados, com transições de opacidade e desfoque.
- **Steve interativo:** acompanha o mouse, com movimentos de cabeça, corpo e braços conforme as partes disponíveis no modelo.
- **Interação por toque:** controle do personagem em dispositivos com tela sensível ao toque.
- **Iluminação 3D:** combinação de luzes para destacar o personagem.
- **Barra de progresso:** indica o avanço da rolagem na página.
- **Botão de voltar ao início:** fixo no canto inferior direito, com retorno suave.
- **Layout responsivo:** estilos adaptados para desktop, tablet e celular.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Aplicação |
| --- | --- |
| HTML5 | Estrutura e conteúdo da página |
| CSS3 | Layout, responsividade e efeitos visuais |
| JavaScript | Interações e controle das animações |
| Three.js | Renderização das cenas e modelos 3D |
| GLTFLoader | Carregamento dos modelos no formato GLB |
| GSAP | Animação de elementos e propriedades dos modelos |
| ScrollTrigger | Sincronização das animações com a rolagem |

As bibliotecas são carregadas por CDN. O projeto utiliza módulos JavaScript e `importmap`, sem necessidade de uma etapa de build.

## 📂 Arquivos do projeto

| Arquivo | Descrição |
| --- | --- |
| `index.html` | Estrutura da página e importação das bibliotecas |
| `style.css` | Estilos, efeitos visuais e regras responsivas |
| `script.js` | Cenas 3D, interações e animações |
| `assets/bee.glb` | Modelo 3D da abelha |
| `assets/steve.glb` | Modelo 3D do Steve |
| `assets/img1.jpeg` | Imagem de fundo principal |
| `assets/img3.jpeg` | Imagem de fundo da segunda seção |
| `assets/Minecrafter.Reg.ttf` | Fonte temática dos títulos |
| `README.md` | Documentação do projeto |

## 🚀 Como executar

1. Baixe ou clone este repositório.
2. Abra a pasta do projeto no VS Code.
3. Confira se os modelos, as imagens e a fonte estão na pasta `assets`.
4. Execute o projeto com um servidor local, como a extensão **Live Server**.
5. Abra o endereço local no navegador.

Com o Live Server instalado, clique com o botão direito em `index.html` e selecione **Open with Live Server**.

### Alternativa com Python

Se você tem Python instalado, execute este comando na pasta do projeto:

```bash
python -m http.server 8000
```

Depois, acesse:

```text
http://localhost:8000
```

Use um servidor local em vez de abrir o HTML diretamente por `file://`, para permitir o carregamento dos módulos e modelos 3D.

O projeto precisa de conexão com a internet para carregar as bibliotecas externas e de um navegador com suporte a WebGL.

## 🎨 Decisões de desenvolvimento

### Identidade visual

A fonte temática, os tons de verde e as sombras com bordas marcadas aproximam a interface da estética de blocos do Minecraft. Gradientes sobre as imagens ajudam a destacar os textos.

### Cenas 3D independentes

A abelha e o Steve utilizam cenas, câmeras e renderizadores separados. Isso permite ajustar a iluminação, o enquadramento e o comportamento de cada modelo de forma independente.

### Animações de rolagem

O GSAP e o ScrollTrigger controlam o deslocamento da abelha e a apresentação dos textos conforme o usuário percorre as seções.

No título principal, os elementos internos recebem a animação de entrada, enquanto o `h1` recebe a animação de saída.

### Movimento suave do Steve

A posição do mouse é convertida em valores de rotação. Uma interpolação suaviza a transição entre a posição atual e a desejada, evitando movimentos bruscos.

A identificação de cabeça, torso e braços depende dos nomes das partes presentes no arquivo 3D.

### Responsividade e desempenho

- Uso de `clamp()` para adaptar fontes e espaçamentos.
- Media queries para tablet e celular.
- Densidade de pixels dos renderizadores limitada a 2.
- Fundo fixo desativado em telas menores.
- Desfoque dos textos aplicado apenas no desktop.
- Redução das animações de conteúdo quando o usuário ativa a preferência por movimento reduzido.

## 📚 Aprendizados

O desenvolvimento permitiu praticar:

- Integração de modelos GLB em páginas web.
- Configuração de cenas, câmeras e luzes com Three.js.
- Uso de `AnimationMixer` para reproduzir animações dos modelos.
- Criação de timelines com GSAP.
- Controle de animações com ScrollTrigger.
- Interação entre eventos do ponteiro e objetos 3D.
- Adaptação do layout para diferentes tamanhos de tela.

## 🔧 Próximas melhorias

- Otimizar imagens e modelos para reduzir o tempo de carregamento.
- Pausar a renderização das cenas quando estiverem fora da tela.
- Ampliar o suporte a movimento reduzido para os modelos 3D.
- Revisar a interação por toque do Steve para não bloquear a rolagem da página.
- Fixar uma versão específica do Three.js no lugar de `latest`.
- Adicionar tratamento de erro no carregamento da abelha.

## 👨‍💻 Autor

Desenvolvido por **Carlos Guaregua**, como projeto de estudo e portfólio front-end.

## 📌 Créditos

Projeto independente inspirado em Minecraft, sem vínculo oficial com Mojang Studios ou Microsoft.

As marcas e os materiais utilizados pertencem aos respectivos titulares. Este repositório não concede licença sobre modelos, imagens ou fontes de terceiros.
