<template>
  <section>
    <section class="main">
      <h6>Coding Garden with CJ LIVE subscriber count</h6>
      <div class="sub-count"></div>
      <small>As of: {{last_updated.toLocaleTimeString()}}</small>
    </section>
    <span
      class="emoji"
      v-for="emoji in emojis"
      :style="emoji.style"
      :key="emoji.id">{{emoji.emoji}}</span>
  </section>
</template>

<script>
import io from 'socket.io-client';
import $ from 'jquery';
import flipclock from 'flipclock';
import 'flipclock/dist/flipclock.css';

import dropSound from './single-drop.mp3';
import clipSound from './one-clip.mp3';

const audio = new Audio(dropSound);

const API_URL = window.location.hostname == 'localhost' ? 'http://localhost:5000' : 'https://cg-rt-sub-api.now.sh';
const emojiChoices = ['🌈', '💧', '💦', '🎉', '🎊', '📹', '📺', '⌨️', '😻', '😽', '🌸', '🌺', '🌻', '🌹', '🌼', '🌷', '💐'];

const rainCount = 30000;

export default {
  data: () => ({
    clock: null,
    stats: {},
    last_updated: new Date(),
    emojis: [],
    raining: false,
  }),
  watch: {
    stats(newValue, oldValue) {
      const { subscriberCount: newSubCount } = newValue;
      const { subscriberCount: oldSubCount } = oldValue;

      if (newSubCount != oldSubCount) {
        if (newSubCount >= rainCount && !this.emojis.length) {
          this.raining = true;
          this.rainEmoji();
        } else if (newSubCount < rainCount) {
          this.raining = false;
          this.emojis = [];
        }

        if (!this.clock) {
          this.clock = $('.sub-count').FlipClock(newSubCount  - 1, {
            clockFace: 'Counter',
            autoStart: false,
            autoPlay: false
          });
        } else {
          this.clock.setFaceValue(newSubCount - 1);
          if (newSubCount > oldSubCount) {
            audio.src = dropSound;
          } else {
            audio.src = clipSound;
          }
          audio.currentTime = 0;
          audio.play();
        }
        this.clock.stop();
        this.clock.setFaceValue(newSubCount  - 1);
      }
    }
  },
  mounted() {
    fetch(API_URL + '/stats')
      .then(res => res.json())
      .then(stats => {
        this.stats = stats
        this.last_updated = new Date();
      });

    const socket = io(API_URL);
    socket.on('stats', (stats) => {
      this.stats = stats;
      this.last_updated = new Date();
    });
  },
  methods: {
    rainEmoji() {
      Array.from({ length: 50 }, (_, id) => {
        this.emojis.push({
          id,
          emoji: this.randomEmoji(),
          style: {
            fontSize: ((Math.random() * 5) + 5) + 'vh',
            yIncrease: Math.random() + 0.5,
            translateValue: -25,
            top: '-25px',
            opacity: Math.random(),
            left: Math.floor(Math.random() * window.innerWidth) + 'px'
          }
        })
      });

      requestAnimationFrame(() => {
          this.updateEmojis();
      });
    },
    randomEmoji() {
      return emojiChoices[Math.floor(Math.random() * emojiChoices.length)];
    },
    updateEmojis() {
      this.emojis.forEach(emoji => {
        emoji.style.translateValue += (emoji.style.yIncrease) * emoji.style.fontSize.replace('vh', '');
        emoji.style.transform = `translateY(${emoji.style.translateValue}px) translateZ(0)`;
        if (emoji.style.translateValue > window.innerHeight) {
          emoji.style.translateValue = -100;
          emoji.emoji = this.randomEmoji();
          emoji.style.left = Math.floor(Math.random() * window.innerWidth) + 'px';
          emoji.style.fontSize = ((Math.random() * 5) + 5) + 'vh';
          emoji.style.opacity = Math.random();
        }
      });

      if (this.raining) {
        requestAnimationFrame(() => {
          this.updateEmojis();
        });
      }
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Share+Tech+Mono');

body {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10vh;
  height: 100vh;
  margin: 0px;
  color: white;
  text-align: center;
  background: url('https://i.imgur.com/xBlt1EJ.png')  no-repeat center center fixed;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10vh 0;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0px;
}

.sub-count {
  background: transparent !important;
  display: flex;
  justify-content: center;
  padding: 7vh;
}

.emoji {
  position: absolute;
  will-change: transform;
}

h6, small {
  background-color: rgb(0, 0, 0, 0.5);
}
</style>
