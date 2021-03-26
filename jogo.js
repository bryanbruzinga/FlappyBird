const sprites = new Image();
sprites.src = "./sprites.png";

let frames = 0;
const pulo = new Audio();
pulo.src = "./efeitos/pulo.wav";
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
      pulo.play();
      this.velocidade = -this.pulo;
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
      if (fazColisao(this, globais.chao)) {
        hitSom.play();

        mudarDeTela(telas.gameOver);

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

const mensagemGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: canvas.width / 2 - 226 / 2,
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

function criarCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    desenha() {
      this.pares.forEach((par) => {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;

        const canoCeuX = par.x;
        const canoCeuY = yRandom;
        contexto.drawImage(
          sprites,
          this.ceu.spriteX,
          this.ceu.spriteY,
          this.largura,
          this.altura,
          canoCeuX,
          canoCeuY,
          this.largura,
          this.altura
        );
        const canoChaoX = par.x;
        const canoChaoY = this.altura + espacamentoEntreCanos + yRandom;

        contexto.drawImage(
          sprites,
          this.chao.spriteX,
          this.chao.spriteY,
          this.largura,
          this.altura,
          canoChaoX,
          canoChaoY,
          this.largura,
          this.altura
        );
        par.canoCeu = {
          x: canoCeuX,
          y: this.altura + canoCeuY,
        };
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY,
        };
      });
    },
    temColisaoComFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

      if (globais.flappyBird.x + globais.flappyBird.largura >= par.x) {
        if (cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }
        if (peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if (passou100Frames) {
        this.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      this.pares.forEach((par) => {
        par.x = par.x - 2;

        if (this.temColisaoComFlappyBird(par)) {
          hitSom.play();
          mudarDeTela(telas.gameOver);
        }

        if (par.x + this.largura <= 0) {
          this.pares.shift();
        }
      });
    },
  };
  return canos;
}

function criarPlacar() {
  const placar = {
    pontuacao: 0,
    desenha() {
      contexto.font = "35px 'VT323'";
      contexto.textAlign = "right";
      contexto.fillStyle = "white";
      contexto.fillText(`${this.pontuacao}`, canvas.width - 10, 35);
      this.pontuacao;
    },
    atualiza() {
      const intervaloDeFrames = 100;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if (passouOIntervalo) {
        this.pontuacao += 1;
      }
    },
  };
  return placar;
}

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
      globais.canos = criarCanos();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.flappyBird.desenha();
      globais.chao.desenha();
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
  inicializa() {
    globais.placar = criarPlacar();
  },
  desenha() {
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
    globais.placar.desenha();
  },
  click() {
    globais.flappyBird.pular();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.flappyBird.atualiza();
    globais.chao.atualiza();
    globais.placar.atualiza();
  },
};

telas.gameOver = {
  desenha() {
    mensagemGameOver.desenha();
  },
  atualiza() {},

  click() {
    mudarDeTela(telas.inicio);
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
