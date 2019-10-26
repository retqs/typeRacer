import React, { Component } from 'react';

class App extends Component {
  state = {
    text: '',
    inputValue: '',
    lastLetter: '',
    words: [],
    completedWords: [],
    completed: false,
    progress: 0,
    wpm: 0,
    started: false,
    backgrounds: [
      `to right,#9733ee,#da22ff`,
      `to right, #2b5876, #4e4376`,
      `to right, #cc2b5e, #753a88`,
      `to right, #9796f0, #fbc7d4`,
      `to right, #ee9ca7, #ffdde1`,
      `to right, #0f2027, #203a43, #2c5364`,
      `to right, #ff0099, #493240`,
      `to right, #aa4b6b, #6b6b83, #3b8d99`,
      `to right, #200122, #6f0000`,
      `to right, #4568dc, #b06ab3`,
      `to right, #3B4371, #F3904F`
    ],
    startTime: Date.now()
  };

  componentDidMount() {
    this.loading();
  }

  loading = () => {
    setTimeout(() => {
      this.setText();
      if (this.state.text) this.changeBackground();
    }, 1000);
  };

  startGame = () => {
    this.setText();
    if (this.state.text) this.changeBackground();
    this.setState({
      started: true,
      startTime: Date.now(),
      completed: false,
      progress: 0,
      wpm: 0
    });
  };

  setText = () => {
    const texts = [
      `A spider's body consists of two main parts: an anterior portion, the prosoma (or cephalothorax), and a posterior part, the opisthosoma (or abdomen).`,
      `collapse, yourself, morning, obsessive, deficient, That's, Christmas, disappeared, disappear, perhaps, dragged, satisfied, This, clad, purest, boson, signifying, Arthur, your, sailed, worse, provisions, running, knives, going, provisions.`,
      `I became yearbook photographer because I liked the idea that I could sort of watch life without having to be part of it. But when you're yearbook photographer, you're like never in the picture.`,
      `Oh! And it is lovely! Just beautiful. You know you are quite a decorator. It's amazing what you've done with such a modest budget. I like that boulder. That is a nice boulder. I guess you don't entertain much, do you?`
    ];

    const text = texts[Math.floor(Math.random() * texts.length)];
    const words = text.split(' ');

    this.setState({
      text,
      words,
      completedWords: []
    });
  };

  changeBackground = () => {
    const { backgrounds } = this.state;
    const randomNumber = Math.floor(Math.random() * backgrounds.length);
    const wrapper = document.querySelector('.wrapper');
    wrapper.style.background = `linear-gradient(${backgrounds[randomNumber]})`;
  };

  changeText = () => {
    this.setText();
    this.changeBackground();

    this.setState({
      inputValue: '',
      wpm: 0,
      progress: 0
    });
  };

  handleChange = e => {
    const { completedWords, words } = this.state;

    const inputValue = e.target.value;
    const lastLetter = inputValue[inputValue.length - 1];

    const currentWord = words[0];
    if (lastLetter === ' ' || lastLetter === '.') {
      if (inputValue.trim() === currentWord) {
        const newWords = [...words.slice(1)];
        const newCompletedWords = [...completedWords, currentWord];

        const progress = (newCompletedWords.length / (newWords.length + newCompletedWords.length)) * 100;
        this.setState({
          words: newWords,
          completedWords: newCompletedWords,
          inputValue: '',
          completed: newWords.length === 0,
          progress
        });
      }
    } else {
      this.setState({
        inputValue,
        lastLetter
      });
    }
    this.calcWpm();
  };

  calcWpm = () => {
    const { startTime, completedWords } = this.state;

    const now = Date.now();
    const diff = (now - startTime) / 1000 / 60;

    const wordsTyped = Math.ceil(completedWords.reduce((acc, word) => (acc += word.length), 0) / 5);

    const wpm = Math.ceil(wordsTyped / diff);

    this.setState({
      wpm
    });
  };

  render() {
    const { progress, text, wpm, inputValue, completed, completedWords } = this.state;

    if (!text) {
      return (
        <div className='animationLoading'>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      );
    }

    if (completed) {
      return (
        <div className='wrapper'>
          <div className='container'>
            <span className='container__modalTitle'>
              Your WPM is <strong>{wpm}</strong>
            </span>
            <button className='container__playAgainBtn' onClick={this.startGame}>
              Restart
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className='wrapper'>
        <div className='wpm'>
          <strong>WPM: {wpm}</strong>
        </div>

        <div className='container'>
          <button className='newText' onClick={this.changeText}>
            get a new text
          </button>
          <progress value={progress} max='100' className='container__progress'></progress>
          <span className='container__text'>
            {text.split(' ').map((word, id) => {
              let highlight = false;
              let currentWord = false;

              if (completedWords.length > id) {
                highlight = true;
              } else if (completedWords.length === id) {
                currentWord = true;
              }
              return (
                <span
                  className={`word
                    ${highlight && 'green'}
                    ${currentWord && 'underline'}`}
                  key={id}
                >
                  {word.split('').map((letter, index) => {
                    const isCurrentWord = id === completedWords.length;
                    const isWronglyTyped = letter !== inputValue[index];
                    const highlighted = index < inputValue.length;

                    return (
                      <span
                        className={`letter ${isCurrentWord && highlighted ? (isWronglyTyped ? 'red' : 'green') : ''}`}
                        key={index}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </span>
          <input
            placeholder='Start Type...'
            onChange={this.handleChange}
            type='text'
            value={inputValue}
            className='container__input'
          ></input>
        </div>
      </div>
    );
  }
}

export default App;
