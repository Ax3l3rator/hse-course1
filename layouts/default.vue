<template>
  <div>
    <v-layout>
      <v-navigation-drawer permanent class="d-block" rail expand-on-hover>
        <v-list-item
          title="Имя Студента"
          class="py-2"
          subtitle="mail@domain.name"
          nav
          to="user"
        >
          <template v-slot:prepend
            ><v-avatar color="primary" icon="mdi-account"></v-avatar>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-magnify"
            title="Поиск расписания"
            value="search"
            to="/"
          ></v-list-item>
          <!-- <v-list-item
            prepend-icon="mdi-fire"
            title="Дедлайны"
            value="deadlines"
            to="deadlines"
          ></v-list-item> -->
          <v-list-item
            prepend-icon="mdi-calendar"
            title="Свободные аудитории"
            value="free"
            to="free"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main><slot /></v-main>
    </v-layout>
  </div>
</template>
