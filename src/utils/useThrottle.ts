import { Ref, onMounted, onUnmounted, ref } from "vue";
type TimerOption = {
  ms?: number
  times?: number
  destroyAfterUnmounted?: boolean
  startWhenMounted?: boolean
}
export default function (callback: (i: number) => any, options?: TimerOption): [
  () => void,
  () => void,
  Ref<boolean>
] {

  const ms = options?.ms ?? 1 * 1000;
  const times = options?.times ?? 1;
  const destroyAfterUnMounted = options?.destroyAfterUnmounted ?? false;
  const startWhenMounted = options?.startWhenMounted ?? false;

  const timer = ref<NodeJS.Timeout>();
  const i = ref(1)
  const isIdle = ref(true)

  function startTimer() {
    if (!!timer.value) return
    isIdle.value = false
    callback(i.value)

    timer.value = setTimeout(() => {
      i.value++
      stopTimer()
      if (i.value <= times) {
        startTimer()
      } else {
        isIdle.value = true
        i.value = 1
      }
    }, ms);
  }

  function clean() {
    i.value = 1
    stopTimer()
  }

  const stopTimer = () => {
    if (timer.value === void 0) return
    clearTimeout(timer.value);
    timer.value = void 0;
  };

  onUnmounted(() => {
    if (destroyAfterUnMounted) {
      i.value = 1
      stopTimer();
    }
  });

  onMounted(() => {
    if (startWhenMounted) {
      startTimer()
    }
  })
  return [
    startTimer,
    clean,
    isIdle,
  ]
}