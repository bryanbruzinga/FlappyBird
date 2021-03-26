const sprites = new Image();
sprites.src = "./sprites.png";

let frames = 0;
const hitSom = new Audio();
hitSom.src = "./efeitos/hit.wav";

const canvas = document.querySelector("canvas");
const contexto = canvas.getContext("2d");

// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = "#70c5ce";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.largura,
      this.altura,
      this.x,
      this.y,
      this.largura,
      this.altura
    );

    contexto.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.largura,
      this.altura,
      this.x + this.largura,
      this.y,
      this.largura,
      this.altura
    );
  },
};

// [Chao]

function criarChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = this.largura / 2;
      const movimentacao = this.x - movimentoDoChao;
      this.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        this.spriteX,
        this.spriteY,
        this.largura,
        this.altura,
        this.x,
        this.y,
        this.largura,
        this.altura
      );
      contexto.drawImage(
        sprites,
        this.spriteX,
        this.spriteY,
        this.largura,
        this.altura,
        this.x + this.largura,
        this.y,
        this.largura,
        this.altura
      );
    },
  };
  return chao;
}

function criarFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pular() {
      this.velocidade = -this.pulo;
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
      if (fazColisao(this, globais.chao)) {
        hitSom.play();

        setTimeout(() => {
          mudarDeTela(telas.inicio);
        }, 500);

        return;
      }
      this.velocidade = this.velocidade + this.gravidade;
      this.y = this.y + this.velocidade;
    },
    movimentos: [
      { spriteX: 0, spriteY: 0 },
      { spriteX: 0, spriteY: 26 },
      { spriteX: 0, spriteY: 52 },
    ],
    frameAtual: 0,
    atualizarFrameAtual() {
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;
      if (passouOIntervalo) {
        const basedoIncremento = 1;
        const incremento = basedoIncremento + this.frameAtual;
        const baseRepeticao = this.movimentos.length;
        this.frameAtual = incremento % baseRepeticao;
      }
    },
    desenha() {
      this.atualizarFrameAtual();
      const { spriteX, spriteY } = this.movimentos[this.frameAtual];
      contexto.drawImage(
        sprites,
        spriteX,
        spriteY,
        this.largura,
        this.altura,
        this.x,
        this.y,
        this.largura,
        this.altura
      );
    },
  };
  return flappyBird;
}

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY) {
    return true;
  }
  return false;
}

const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
  },
};

// Telas
const globais = {};
let telaAtiva = {};

function mudarDeTela(novaTela) {
  telaAtiva = novaTela;

  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}
const telas = {
  inicio: {
    inicializa() {
      globais.flappyBird = criarFlappyBird();
      globais.chao = criarChao();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudarDeTela(telas.jogo);
    },
    atualiza() {
      globais.chao.atualiza();
    },
  },
};

telas.jogo = {
  desenha() {
    planoDeFundo.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pular();
  },
  atualiza() {
    globais.flappyBird.atualiza();
    globais.chao.atualiza();
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();
  frames = frames + 1;

  requestAnimationFrame(loop);
}
window.addEventListener("click", () => {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});
mudarDeTela(telas.inicio);
loop();
