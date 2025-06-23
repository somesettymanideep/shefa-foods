if (!customElements.get('count-down')) {
    class CountDown extends HTMLElement {

        constructor() {
            super();
            this.settings = {
                layout: '<span class="box-count day"><span class="number">0</span><span class="text">Days</span></span><span class="box-count hrs"><span class="number">0</span><span class="text">Hrs</span></span><span class="box-count min"><span class="number">0</span><span class="text">Mins</span></span><span class="box-count secs"><span class="number">0</span> <span class="text">Secs</span></span>',
                leadingZero: true,
                countStepper: -1, // s: -1 // min: -60 // hour: -3600
                timeout: '<span class="timeout">Time out!</span>',
            }
            var $this = this;
            document.addEventListener("CountDownUpdated", function (event) {
                $this.init();
            });
            document.dispatchEvent(new CustomEvent('CountDownReady', {detail:$this}));
        }

        connectedCallback() {
             this.init();
        }

        uniqid(length) {
            length = length || 10;
            var result = "",
                characters = "abcdefghijklmnopqrstuvwxyz0123456789",
                charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return result;
        }

        init() {
            if (this.classList.contains("count-down-init")) return;
            var data  = this.datasetToObject(this.dataset);
            Object.assign(this.settings, data);
            this.classList.add('count-down-init');
            this.renderTimer();
        }

        datasetToObject(dataset) {
            return JSON.parse(JSON.stringify(dataset), (key, value) => {
                if (value === "null") return null;
                if (value === "true") return true;
                if (value === "false") return false;
                if (!isNaN(value)) return Number(value);
                try {
                return JSON.parse(value);
                } catch (e) {
                return value;
                }
            });
        }
      
        renderTimer() {
            var data  = this.datasetToObject(this.dataset);
            if(!data.timer){
                var date = new Date(),
                    year = ('y' in data) ? Number(data.y.toString().replace("yyyy", date.getFullYear())) : date.getFullYear(),
                    mm   = ('m' in data) ? Number(data.m.toString().replace("mm", date.getMonth() + 1)) : date.getMonth() + 1,
                    dd   = ('d' in data) ? Number(data.d.toString().replace("dd", date.getDate() + 1)) : date.getDate() + 1,
                    hh   = ('h' in data) ? Number(data.h.toString().replace("hh", date.getHours())) : date.getHours(),
                    ii   = ('i' in data) ? Number(data.i.toString().replace("ii", date.getMinutes())) : date.getMinutes(),
                    ss   = ('s' in data) ? Number(data.s.toString().replace("ss", date.getSeconds())) : date.getSeconds(),
                    newDate = new Date(year, mm -1, dd, hh, ii, ss); // the month is 0-indexed

                    if('plusHour' in data) newDate.setHours(newDate.getHours() + Number(data.plusHour));
                    if('plusMin' in data) newDate.setMinutes(newDate.getMinutes() + Number(data.plusMin));
                    if('plusSec' in data) newDate.setSeconds(newDate.getSeconds() + Number(data.plusSec));

                data.timer = newDate;
            }
            var gsecs = data.timer;
            if (typeof gsecs === 'string') gsecs = gsecs.replace(/-/g, '/');
            if (isNaN(gsecs) || typeof gsecs === 'object') {
                var start = Date.parse(new Date());
                var end = isNaN(gsecs) ? Date.parse(gsecs) : gsecs;
                var end = (typeof gsecs === 'object') ? gsecs : Date.parse(gsecs);
                gsecs = (end - start) / 1000;
            }
            if (gsecs > 0) {
                var isLayout = this.querySelector('.min .number');
                if (!isLayout) {
                    this.innerHTML = this.settings.layout;                                   
                }
                this.CountBack(gsecs);
            } else {
                this.classList.add('the-end');
                if(this.settings.timeout) this.innerHTML = this.settings.timeout;
            }
        }

        calcage(secs, num1, num2) {
            var s = ((Math.floor(secs / num1) % num2)).toString();
            if (this.settings.leadingZero && s.length < 2) s = "0" + s;
            return "<b>" + s + "</b>";
        }

        CountBack(secs) {
            var $this = this,
                countStepper = this.settings.countStepper,
                setTimeOutPeriod = (Math.abs(countStepper) - 1) * 1000 + 990;
            var count = setInterval(function timer() {
                if (secs < 0) {
                    clearInterval(count);
                    $this.classList.add('the-end');
                    if($this.settings.timeout) $this.innerHTML = $this.settings.timeout;
                    return;
                }
                var day  = $this.querySelector('.day .number'),
                    hour = $this.querySelector('.hour .number, .hrs .number'),
                    min  = $this.querySelector('.min .number'),
                    sec  = $this.querySelector('.sec .number, .secs .number');
                if(day)  day.innerHTML  = $this.calcage(secs, 86400, 100000);
                if(hour) hour.innerHTML = $this.calcage(secs, 3600, 24);
                if(min)  min.innerHTML  = $this.calcage(secs, 60, 60);
                if(sec)  sec.innerHTML  = $this.calcage(secs, 1, 60);
                secs += countStepper;
                return timer;
            }(), setTimeOutPeriod);
        }

        appendStyle(css) {
            var style = document.createElement('style');
                style.setAttribute('type', 'text/css');
                style.textContent = css;
            document.head.appendChild(style);
        }

    }

    customElements.define("count-down", CountDown);
}