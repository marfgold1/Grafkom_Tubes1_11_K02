export default class Animation {
  /** Cosine dilatation, according to y = A cos(B(x-D)) + C
   * @param {number} amplitude Amplitude of the cosine function
   * @param {number} frequency Wave frequency of the cosine function
   * @param {number} phase_shift Phase shift of the cosine function in miliseconds
   * @param {number} vert_shift Vertical shift of the cosine function
   */
  static cosine_dilate(
    amplitude=1, 
    frequency=Math.PI, 
    phase_shift=0, 
    vert_shift=1,
    current_time=Date.now()
    ) {
      // TODO: Give frames
      const period = 2*Math.PI / frequency;
      const period_milliseconds = period * 1000;
      const current_time_mod = current_time % period_milliseconds;
      // Implement the cosine function
      const current_scale = amplitude * Math.cos(frequency * (current_time_mod - phase_shift)) + vert_shift
      return current_scale;
  }

  /**
   * Check whether the given function results in all positive values of y
   * @param {number} amplitude Amplitude of the cosine function
   * @param {number} vert_shift Vertical shift of the cosine function
   */
  check_all_positive(amplitude, vert_shift) {
    return Math.min(amplitude + vert_shift, amplitude - vert_shift);
  }

  /**
   * Normalize the given function
   * @param {number} amplitude Amplitude of the normal
   * @param {number} vert_shift Vertical shift of the cosine function
   */
  normalize_scale(amplitude, vert_shift) {
    const max_value = Math.max(amplitude - vert_shift, amplitude + vert_shift);
    const min_value = Math.min(amplitude - vert_shift, amplitude + vert_shift);
    if (max_value < 0 && min_value < 0) {
      const result = {
        amplitude: Math.abs(amplitude),
        vert_shift: max_value / 2,
      }
      return result;
    }
    else if (max_value > 0 && min_value < 0) {
      const result = {
        amplitude: Math.abs(max_value / 2),
        vert_shift: max_value / 2
      }
      return result;
    }
    else {
      const result = {
        amplitude: amplitude,
        vert_shift: vert_shift
      }
      return result;
    }
  }
}