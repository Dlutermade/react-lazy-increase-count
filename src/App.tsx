import React from "react";
import "./App.css";

// 版本一，只管更新，不管更新速率是否一致
function App1(): JSX.Element {
  const [count, setCount] = React.useState(0);

  const handleIncrease = () => {
    const freq = Array(5).fill(1);

    freq.forEach((num, i) =>
      setTimeout(() => {
        setCount((prev) => prev + num);
      }, 500 * i)
    );
  };

  return (
    <div className="App">
      <h1> {count} </h1>
      <button onClick={handleIncrease}>+5</button>
    </div>
  );
}

// 版本二，每次按下按鈕 重新生成 更新序列 快速按時候沒感覺，但慢速按下會有差異
function App2(): JSX.Element {
  const [count, setCount] = React.useState(0);
  const realCount = React.useRef(0);
  const timers = React.useRef<number[]>([]);

  const handleIncrease = () => {
    realCount.current += 5;
    timers.current.forEach((id) => clearTimeout(id));

    Array(realCount.current - count)
      .fill(1)
      .forEach((num, i) => {
        const timer = setTimeout(() => {
          setCount((prev) => prev + num);
          timers.current = timers.current.filter((id) => id !== timer);
        }, 500 * i);

        timers.current.push(timer);
      });
  };

  return (
    <div className="App">
      <h1>{count}</h1>
      <button onClick={handleIncrease}>+5</button>
    </div>
  );
}

// 版本三，每次按下按鈕 增加到更新佇列，保證更新的一致速率
function App3(): JSX.Element {
  const [count, setCount] = React.useState(0);
  const [timerQueue, setTimerQueue] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (timerQueue.length !== 0) {
      const ID = setInterval(() => {
        setTimerQueue((prev) => {
          const [addNum, ...newTimerQueue] = prev;

          setCount((prev) => prev + addNum);

          return newTimerQueue;
        });
      }, 500);

      return () => clearInterval(ID);
    }
  }, [timerQueue.length !== 0]);

  const handleIncrease = () => {
    Array(5)
      .fill(1)
      .forEach((num) => {
        setTimerQueue((prev) => [...prev, num]);
      });
  };

  return (
    <div className="App">
      <h1>{count}</h1>
      <button onClick={handleIncrease}>+5</button>
    </div>
  );
}

export default App3;
