<template>
  <div class="coverBg rellax h-[130vh] w-screen absolute bg-darkgreen overflow-x-hidden">
    <div class="imagesContainer flex min-w-full w-full h-auto min-h-full opacity-50">
      
      <Transition mode="out-in" name="fade-zoom">
        <img
          class="inline-block object-cover w-full"
          :style="imageStyle"
          :src="images[imgToShow]"
          :key="imgToShow"
        />
      </Transition>
    </div>
  </div>

  <div
    data-rellax-speed="3"
    class="rellax content relative z-10 flex justify-center items-center min-h-[130vh]"
  >
  <div class="loginWrapper w-3/4 lg:w-1/2 xl:w-1/3 flex flex-col justify-center gap-4 -translate-y-[15vh]">
        <div class="copyWriting self-center flex flex-col gap-4">
          <Transition mode="out-in" name="swing">
            <h1 v-if="heroShown == 'hello'" key="128121" class="text-lightgreen heroText text-left">
              <div class="wave inline-block">👋</div>
              Students,<br />
              Welcome to <br />
              UniExplorers
            </h1>
            <h1 v-else key="3891893" class="text-lightgreen heroText inline-block text-left">
              Effortless <br />
              Exchange <br />
              Exploration
            </h1>
          </Transition>
          <RouterLink v-if="$route.path == '/'" to="/sign-in">
            <button class="bg-darkgreen px-4 py-2 rounded text-white font-medium">Click here to sign in</button>
          </RouterLink>
          <RouterView/>
      </div>
    </div>
  </div>

  <div data-rellax-speed="7" class="rellax relative moreCopyContent min-h-screen h-auto bg-lightgreen px-16 pt-16">
    <svg class="absolute w-full -translate-y-full left-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path class="fill-lightgreen" fill-opacity="1" d="M0,64L40,90.7C80,117,160,171,240,181.3C320,192,400,160,480,170.7C560,181,640,235,720,234.7C800,235,880,181,960,176C1040,171,1120,213,1200,197.3C1280,181,1360,107,1400,69.3L1440,32L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>

                <div class="flex max-h-[30vh] w-auto justify-around sm:my-0 sm:my-48">
                    <div data-rellax-speed="2" data-rellax-percentage="0.5" data-rellax-zindex="5" class="rellax wrapper flex flex-col justify-center w-fit">
                      <h2 class="copyCard">
                          Tailor your Academic Experience
                      </h2>
                      <p class="copyDesc">
                        Map your mods quickly with our quick module mapping feature
                      </p>
                      <p class="copyDesc">
                        Discover your ideal school life and environment
                      </p>
                      <p class="copyDesc">
                        Your unique exchange, your personal experience
                      </p>
                    </div>
                    <img src="/vectors/linkages.svg" data-rellax-speed="7" data-rellax-percentage="0.5" class="rellax copySVG lg:max-w-[25%]">
                </div>

                
                <div class="flex h-[30vh] w-auto justify-around my-48 relative">
                  <div data-rellax-speed="2" data-rellax-percentage="0.5" class="rellax BACKGROUNDWHITEONLY -top-1/2 bg-white h-[60vh] w-screen absolute"></div>
                  <img data-rellax-speed="6" data-rellax-percentage="0.4" src="/vectors/map.svg" class="rellax copySVG max-h-full max-w-full ">
                    <div data-rellax-speed="2" data-rellax-percentage="0.5" data-rellax-zindex="5" class="rellax wrapper flex flex-col justify-center w-fit ml-4">
                      <h2 class="copyCard ">
                        Exploration Made Easy
                      </h2>
                      <p class="copyDesc">
                        View recommended places around your potential destination
                      </p>
                      <p class="copyDesc">
                        Note down critical spots to visit by the community
                      </p>
                      <p class="copyDesc">
                        Embrace your wanderlust for adventure
                      </p>
                    </div>
                </div>

                
                <div class="flex h-[30vh] w-auto justify-around my-64">
                    <div data-rellax-speed="2" data-rellax-percentage="0.7" data-rellax-zindex="5" class="rellax wrapper flex flex-col justify-center w-fit">
                      <h2 class="copyCard">
                        Read Real Stories, Relive Their Real Experiences
                      </h2>
                      <p class="copyDesc">
                        Find out testimonies by your favourite alumnis
                      </p>
                      <p class="copyDesc">
                        Link up with fellow local students to plan your trip with
                      </p>
                      <p class="copyDesc">
                        Connect with international students, learn their culture and make lifelong friends
                      </p>
                    </div>
                    <img data-rellax-speed="7" data-rellax-percentage="0.4" src="/vectors/mappeople.svg" class="rellax copySVG">
                </div>
        <!-- </div> -->
        <article>
            
        </article>
    <div class='text-lightgreen'>a</div>
  </div>

  <div class="globe-container flex flex-col md:flex-row items-stretch h-min -translate-y-1/2" >
    <div id="map" class="basis-1/2 hidden sm:block min-h-[500px] 2xl:min-h-full overflow-visible flex item-center"></div>
    <div class="basis-1/2 text-white/80 flex flex-col font-bold italic justify-center p-16">
      This project was made with an intention to address the following Singapore Sustainability Development Goals:
      <ul class="list-inside list-disc my-2 italic">
        <li>SDG 4.3 – By 2030, ensure equal access for all women and men to affordable and quality technical, vocational and tertiary education, including university</li>
        <li>SDG 4.4 – By 2030, substantially increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment, decent jobs and entrepreneurship</li>
        <li>SDG 4.7 – By 2030, ensure that all learners acquire the knowledge and skills needed to promote sustainable development, including, among others, through education for sustainable development and sustainable lifestyles, human rights, gender equality, promotion of a culture of peace and non-violence, global citizenship and appreciation of cultural diversity and of culture’s contribution to sustainable development</li>
      </ul>
    </div>
  </div>
</template>

<script>
import loginForm from '@/components/forms/loginForm.vue'
import signupForm from '@/components/forms/signupForm.vue'
import Rellax from 'rellax'
import * as d3 from 'd3'
import world_json from '@/assets/world.json'
import { useAuthStore } from '@/stores'

export default {
    name: 'App',
    components : {
      signupForm,
      loginForm,
    },
    setup() {
      const clerkStyle = {
        elements: {
        formButtonPrimary: "bg-darkgreen hover:bg-lightgreen hover:text-content active:bg-lightgreenshadow",
        card : {
            "& > :last-child" : {
                backgroundColor : "#DAE3DD",
                color : "#333333"
            }
        },
        headerSubtitle : "hidden",
        main : "flex flex-col-reverse",
        footer : 'hidden',
        rootBox : "ml-[-26px]"
        }
      }
      return { clerkStyle }
    },
    async mounted() {
      const { getClerkActive } = useAuthStore()
      if (await getClerkActive()) {
        this.$router.push('/profile')
      }

      let rellax = new Rellax('.rellax')
      this.intervals = [setInterval(()=>{this.swapHero()}, 4500), setInterval(()=>{this.swapImages()}, 6000)]

      let width = document.getElementById('map').getBoundingClientRect().width
      let container_height = document.getElementById('map').getBoundingClientRect().height
      let height = 500
      const sensitivity = 75

      var x_offset = width / 2 - Math.max((500 - width)/2, 0)
      var y_offset = container_height / 2 - Math.max((500 - container_height)/2, 0)

      let projection = d3
        .geoOrthographic()
        .scale(250)
        .center([0, 0])
        .rotate([0, -30])
        .translate([x_offset, y_offset])

      const initialScale = projection.scale()
      let path = d3.geoPath().projection(projection)

      let svg = d3.select('#map').append('svg').attr('width', width).attr('height', container_height)

      let globe = svg
        .append('circle')
        .attr('fill', '#C4CCC6')
        .attr('stroke', '#000')
        .attr('stroke-width', '0.2')
        .attr('cx', x_offset)
        .attr('cy', y_offset)
        .attr('r', initialScale)

      let map = svg.append('g')

      function loadMapData() {
        map
          .append('g')
          .attr('class', 'countries')
          .selectAll('path')
          .data(world_json.features)
          .enter()
          .append('path')
          .attr('class', (d) => 'country_' + d.properties.name.replace(' ', '_'))
          .attr('d', path)
          .attr('fill', '#1E363E')
          .style('stroke', '#DAE3DD')
          .style('stroke-width', 0.3)
          .style('opacity', 0.8)
      }

      loadMapData()

      // Optional rotate
      d3.timer(function (elapsed) {
        const rotate = projection.rotate()
        const k = sensitivity / projection.scale()
        projection.rotate([rotate[0] - 1 * k, rotate[1]])
        path = d3.geoPath().projection(projection)
        svg.selectAll('path').attr('d', path)
      }, 200)
    },
    unmounted() {
      try {
        this.invervals.forEach(interval => {
          clearInterval(interval)
        })
      } catch (error) {
        // TODO: Figure out this weird unmounted behaviour
        console.log(error)
      }
    },
    data() {
      return {
        email : '',
        imageStyle : null,
        images : Object.values(import.meta.glob("/public/universities/*.png", { import: 'default', eager: true })),
        isLoginMode : true,
        imgToShow : 0,
        heroShown : 'hello',
        intervals : []
      }
    },
    methods : {
      handleSignUp(signedUp) {
        this.email = signedUp
        toggleMode(true)
      },
      toggleMode(loginMode) {
        this.isLoginMode = loginMode
      },
      swapHero() {
        if (this.heroShown == 'hello') {
          this.heroShown = 'bye'
        } else {
          this.heroShown = 'hello'
        }
      },
      swapImages() {
        this.imgToShow++
        if (this.imgToShow >= this.images.length) {
          this.imgToShow = 0
        }
      }
    }
  }


</script>

<style scoped>
.swing-enter-active {
  animation: swing-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
.swing-leave-active {
  animation: swing-out 0.8s cubic-bezier(0.6, -0.28, 0.735, 0.045) both;
}

.fade-zoom-enter-active {
  animation: fade-zoom-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.fade-zoom-leave-active {
  animation: fade-zoom-out 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}

@keyframes fade-zoom-in {
  0% {
    -webkit-transform: scale(0.9);
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fade-zoom-out {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    opacity: 0;
  }
}

.imagesContainer {
  transform: translateX(0%);
}

.wave {
  transform-origin: 70% 70%;
  animation: wiggle 1.5s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite both;
}

@keyframes wiggle {
  0% {
    transform: rotate(10deg);
  }
  10% {
    transform: rotate(24deg);
  }
  20% {
    transform: rotate(2deg);
  }
  30% {
    transform: rotate(24deg);
  }
  40% {
    transform: rotate(6deg);
  }
  50% {
    transform: rotate(20deg);
  }
  60% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(10deg);
  }
}

@keyframes swing-in {
  0% {
    -webkit-transform: rotateX(-70deg);
    transform: rotateX(-70deg);
    -webkit-transform-origin: bottom;
    transform-origin: bottom;
    opacity: 0;
  }
  100% {
    -webkit-transform: rotateX(0);
    transform: rotateX(0);
    -webkit-transform-origin: bottom;
    transform-origin: bottom;
    opacity: 1;
  }
}

@keyframes swing-out {
  0% {
    -webkit-transform: rotateX(0deg);
    transform: rotateX(0deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    opacity: 1;
  }
  100% {
    -webkit-transform: rotateX(70deg);
    transform: rotateX(70deg);
    -webkit-transform-origin: top;
    transform-origin: top;
    opacity: 0;
  }
}

.form-switch-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
div p {
    line-height: 2em;
}

</style>
