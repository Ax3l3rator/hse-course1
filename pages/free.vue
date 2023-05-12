<template>
  <v-app>
    <div class="pa-5">
      <v-form class="pa-0 ma-0" ref="form" v-model="isValid" validate-on="blur">
        <v-row class="pa-0 ma-0" align="center">
          <v-col cols="6">
            <v-autocomplete
              variant="outlined"
              density="compact"
              hide-no-data
              label="Здание"
              single-line
              menu-icon="none"
              v-model:search="name"
              :items="found"
              :rules="[() => !!selected || 'Необходимо заполнить поле']"
              item-title="label"
              v-model="selected"
              return-object
              prepend-inner-icon="mdi-magnify"
              :menu-props="{ maxHeight: 400 }"
              hide-details
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item?.raw?.label"
                  :subtitle="item?.raw?.description"
                >
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-text-field
              density="compact"
              variant="outlined"
              v-model="date"
              label="дд.мм.гггг"
              type="date"
              max="2024-01-01"
              min="2022-01-01"
              :rules="[
                (new Date(date).getFullYear() <=
                  new Date('2024-01-01').getFullYear() &&
                  new Date(date).getFullYear() >=
                    new Date('2022-01-01').getFullYear()) ||
                  'Неправильное значение',
              ]"
              validate-on="input"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn
              :disabled="!isValid"
              :loading="loading"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-magnify"
              @click="submit"
            >
              Поиск
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-divider></v-divider>
      <v-container>
        <v-range-slider
          v-model="rng"
          strict
          :min="1"
          :max="7"
          :step="1"
          density="compact"
          label="Интервал пар"
          show-ticks
          color="primary"
          v-if="!!pavilionsRef"
          thumb-label
        ></v-range-slider>
        <v-list
          v-if="!!pavilionsRef"
          class="pa-2 rounded-lg elevation-3"
          elevation="0"
        >
          <v-list-group
            v-for="(pavilion, index) in pavilionsRef"
            class="my-2 no-select"
          >
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                {{ `${pavilion === null ? 'Другое' : 'Корпус ' + pavilion}` }}
              </v-list-item>
            </template>

            <template
              v-for="(auditorium, index) in freeAuditoriumsRef.filter(
                (freeAuditorium) => freeAuditorium.pavilion === pavilion
              )"
              ><div
                v-if="
                  auditorium.freeLessons.filter(
                    (lsn) => lsn >= rng[0] && lsn <= rng[1]
                  ).length !== 0
                "
              >
                <v-list-item
                  :title="auditorium.name"
                  :subtitle="
                    auditorium.auditoriumType + ', ' + auditorium.capacity
                  "
                  density="compact"
                >
                  <template v-slot:append>
                    Свободна на парах:
                    {{
                      auditorium.freeLessons
                        .filter((lsn) => lsn >= rng[0] && lsn <= rng[1])
                        .toString()
                    }}
                  </template>
                </v-list-item>
                <v-divider
                  class="mx-4 my-2"
                  v-if="
                    index <
                    freeAuditoriumsRef.filter(
                      (freeAuditorium) => freeAuditorium.pavilion === pavilion
                    ).length -
                      1
                  "
                ></v-divider>
              </div>
            </template>
          </v-list-group>
        </v-list>
      </v-container>
    </div>
  </v-app>
</template>

<script setup>
const loading = ref(false);

const found = ref([]);
const name = ref('');
const isTyping = ref(false);
const selected = ref(null);
const form = ref(null);
const isValid = ref(false);
const rng = ref([1, 7]);

const date = ref(null /*new Date().toISOString().split('T')[0]*/);
const freeAuditoriumsRef = ref(null);
const pavilionsRef = ref(null);

function getFreeLessons(lessons) {
  const lesnums = new Set();
  const alllessons = new Set([1, 2, 3, 4, 5, 6, 7]);
  // console.log(lessons);
  for (const lesson of lessons) {
    lesnums.add(lesson.lessonNumberStart);
    lesnums.add(lesson.lessonNumberEnd);
  }

  return [...alllessons].filter((x) => !lesnums.has(x)).sort();
}

function getNumWordForm(num) {
  if (num % 10 == 1) {
    return `${num} место`;
  } else if (num % 10 > 1 && num % 10 < 5) {
    return `${num} места`;
  } else {
    return `${num} мест`;
  }
}

const validated = computed(() => {});

const submit = () => {
  loading.value = true;
  form.value.validate().then(async (val) => {
    if (val.valid) {
      const { data: auditoriums } = await useFetch(
        'https://ruz.hse.ru/api/dictionary/auditoriums',
        {
          query: {
            buildingOid: selected.value.id,
          },
        }
      );
      const { data: lessons } = await useFetch(
        `https://ruz.hse.ru/api/schedule/building/${selected.value.id}`,
        {
          query: {
            start: date.value,
            finish: date.value,
          },
        }
      );
      // console.log(lessons);

      const pavilionsOrigin = new Set(['D', 'G', 'K', 'M', 'N', 'R', 'S', 'T']);

      const freeAuditoriums = [];
      auditoriums.value
        .filter(
          (auditorium) =>
            auditorium.TypeOfAuditoriumOid != 1036 &&
            auditorium.TypeOfAuditoriumOid != 1041 &&
            auditorium.TypeOfAuditoriumOid != 1 &&
            auditorium.TypeOfAuditoriumOid != 1047
        )
        .forEach((auditorium) => {
          // console.log(auditorium);
          freeAuditoriums.push({
            name: auditorium.name,
            freeLessons: getFreeLessons(
              lessons.value.filter(
                (lesson) => lesson.auditorium == auditorium.name
              )
            ),
            pavilion: pavilionsOrigin.has(auditorium.name[0])
              ? auditorium.name[0]
              : null,
            auditoriumType: auditorium.typeOfAuditorium,
            capacity: getNumWordForm(auditorium.amount),
          });
          // console.log(auditorium.amount, getNumWordForm(auditorium.amount));
        });
      // console.log(freeAuditoriums);
      freeAuditoriumsRef.value = freeAuditoriums;
      const pavilions = new Set(
        freeAuditoriums.map((auditorium) => auditorium.pavilion)
      );
      // console.log(pavilions);
      pavilionsRef.value = [...pavilions];
      loading.value = false;
    }
  });
};

watchEffect((onInvalidate) => {
  if (name.value.length >= 3) {
    isTyping.value = true;
    found.value = [];
    const typingTimer = setTimeout(async () => {
      isTyping.value = false;
      const { data } = await useFetch(`https://ruz.hse.ru/api/search`, {
        query: {
          term: name.value,
          type: 'building',
        },
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3001',
        },
      });
      // console.log(data.value);
      found.value = data.value;
    }, 1000);

    onInvalidate(() => {
      clearInterval(typingTimer);
    });
  } else {
    found.value = [];
  }
});
</script>

<style scoped>
.no-select {
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
