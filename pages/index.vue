<template>
  <v-app>
    <div class="pa-5">
      <v-form ref="form" class="pa-0 ma-0" v-model="isValid" validate-on="blur">
        <v-row class="pa-0 ma-0" align="center" align-content="center">
          <v-col cols="4">
            <v-select
              v-model="select"
              return-object
              variant="outlined"
              density="compact"
              placeholder="Объект поиска"
              single-line
              item-title="name"
              item-value="type"
              :items="items"
              @update:model-value="
                users = [];
                name = '';
                selected = [];
              "
              :rules="[!!select || 'Не пустая строка']"
              hide-details
            >
            </v-select>
          </v-col>
          <v-col cols="8">
            <v-autocomplete
              hide-messages
              hide-details
              variant="outlined"
              density="compact"
              menu-icon="null"
              hide-no-data
              :disabled="select === null"
              prepend-inner-icon="mdi-magnify"
              label="Поиск"
              single-line
              :items="users"
              v-model:search="name"
              v-model="selected"
              item-title="label"
              filter-mode="every"
              :menu-props="{ maxHeight: 400 }"
              :rules="[!!selected || 'Не пустая строка']"
              validate-on="blur"
              return-object
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
              variant="outlined"
              density="compact"
              type="date"
              v-model="startDate"
              :rules="[
                (new Date(startDate).getFullYear() <=
                  new Date('2024-01-01').getFullYear() &&
                  new Date(startDate).getFullYear() >=
                    new Date('2022-01-01').getFullYear()) ||
                  'Неправильное значение',
              ]"
              validate-on="blur"
              ><template v-slot:prepend> С </template></v-text-field
            >
          </v-col>
          <v-col cols="4">
            <v-text-field
              variant="outlined"
              density="compact"
              type="date"
              v-model="endDate"
              :rules="[
                (new Date(endDate).getFullYear() <=
                  new Date('2024-01-01').getFullYear() &&
                  new Date(endDate).getFullYear() >=
                    new Date('2022-01-01').getFullYear()) ||
                  'Неправильное значение',
                (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                  (1000 * 60 * 60 * 24) <=
                  7 || 'Разница в датах больше недели',
                new Date(endDate).getTime() - new Date(startDate).getTime() >=
                  0 || 'Второй промежуток раньше первого',
              ]"
              validate-on="blur"
              ><template v-slot:prepend> По </template>
            </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn
              class="mb-6"
              prepend-icon="mdi-magnify"
              variant="outlined"
              color="primary"
              :disabled="!isValid"
              @click="submit"
              >Поиск</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
      <v-divider :thickness="2"></v-divider>
      <v-container fluid>
        <div v-if="schedule !== null">
          <v-list v-for="day in schedule" class="my-2 pb-0 rounded-lg">
            <v-list-item>
              <v-list-item-title class="font-weight-bold no-select">
                {{ day.dateString }}
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item v-for="lesson in day.lessons" class="my-1 no-select">
              <v-card variant="outlined" density="comfortable" class="pa-2">
                <v-card-title>{{ lesson.name }}</v-card-title>
                <v-card-text>
                  <div class="d-flex justify-space-between">
                    <div class="text-medium-emphasis">
                      <v-icon icon="mdi-map-marker" size="small"></v-icon
                      >{{ lesson.place }}
                    </div>

                    <div class="text-medium-emphasis text-right">
                      <v-icon
                        icon="mdi-school"
                        class="mr-1"
                        size="small"
                      ></v-icon
                      >{{ lesson.teacher }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <template v-slot:prepend>
                <v-card variant="tonal" class="mr-3 pa-2">
                  {{ lesson.time }}
                </v-card>
              </template>
            </v-list-item>
          </v-list>
        </div>

        <!-- <v-list
          v-if="!!schedule"
          v-for="stamp in schedule?.keys()"
          class="my-2"
        >
          <v-list-item> </v-list-item>
        </v-list> -->
      </v-container>
    </div>
  </v-app>
</template>

<script setup>
const startDate = ref(null);
const endDate = ref(null);
const isValid = ref(false);
const selected = ref(null);
const users = ref([]);
const name = ref('');
const isTyping = ref(false);
const select = ref(null);
const form = ref(null);
// const found = ref({});

const items = ref([
  { name: 'Студент', type: 'student' },
  { name: 'Группа', type: 'group' },
  { name: 'Преподаватель', type: 'person' },
  { name: 'Аудитория', type: 'auditorium' },
]);
const schedule = ref(null);

const submit = () => {
  form.value.validate().then(async (val) => {
    schedule.value = null;
    if (val.valid) {
      const { data: res } = await useFetch(
        `https://ruz.hse.ru/api/schedule/${select.value.type}/${selected.value.id}`,
        {
          query: {
            start: startDate.value,
            finish: endDate.value,
            lng: 1,
          },
        }
      );
      const lessonsPerDay = new Map();
      const removeFilter = /-?\d+/;
      const months = [
        'Января',
        'Февраля',
        'Марта',
        'Апреля',
        'Мая',
        'Июня',
        'Июля',
        'Августа',
        'Сентября',
        'Октября',
        'Ноября',
        'Декабря',
      ];
      const daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

      res.value.forEach((lesson) => {
        const dateStamp = parseInt(removeFilter.exec(lesson.dateOfNest));

        const addObject = {
          name: lesson.discipline,
          teacher: `${lesson.lecturer_rank} ${lesson.lecturer_title}`,
          place: `${lesson.auditorium}, ${lesson.building}`,
          time: `${lesson.beginLesson}-${lesson.endLesson}`,
        };
        if (lessonsPerDay.has(dateStamp)) {
          lessonsPerDay.get(dateStamp).push(addObject);
        } else {
          lessonsPerDay.set(dateStamp, [addObject]);
        }
      });
      const finalObj = {};
      Array.from(lessonsPerDay.keys()).forEach((key) => {
        finalObj[key] = {
          dateString: `${new Date(key).getDate()} ${
            months[new Date(key).getMonth()]
          }, ${daysOfWeek[new Date(key).getDay() - 1]}`,
          lessons: lessonsPerDay.get(key),
        };
      });
      console.log(finalObj);
      schedule.value = finalObj;
      // lessonsPerDay.forEach((el) => console.log(el));
      // console.log(...lessonsPerDay);
    }
  });
};

watchEffect((onInvalidate) => {
  if (name.value.length >= 3) {
    users.value = [];
    isTyping.value = true;
    const typingTimer = setTimeout(async () => {
      isTyping.value = false;
      const { data } = await useFetch(`https://ruz.hse.ru/api/search`, {
        query: {
          term: name.value,
          type: select.value.type,
        },
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3001',
        },
      });
      users.value = data.value;
    }, 1000);

    onInvalidate(() => {
      clearInterval(typingTimer);
    });
  } else {
    users.value = [];
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
