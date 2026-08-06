/* Creado por Jesús Pirela */
import React from "react";
import { Refine } from "@refinedev/core";
import { notificationProvider, ThemedLayoutV2, ErrorComponent } from "@refinedev/antd";
import { dataProvider } from "@refinedev/supabase";
import { createClient } from "@supabase/supabase-js";
import { ConfigProvider, App as AntdApp } from "antd";
import "@refinedev/antd/dist/reset.css";

// Cliente de Supabase usando variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#2563eb" } }}>
      <AntdApp>
        <Refine
          dataProvider={dataProvider(supabaseClient)}
          notificationProvider={notificationProvider}
          resources={[
            {
              name: "courses",
              list: "/courses",
              meta: { label: "Cursos" }
            },
            {
              name: "profiles",
              list: "/students",
              meta: { label: "Estudiantes" }
            }
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <ThemedLayoutV2
            Title={({ collapsed }) => (
              <div style={{
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.2rem",
                background: "#1e293b"
              }}>
                {collapsed ? "EA" : "EasyGo Academy"}
              </div>
            )}
          >
            <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "80vh" }}>
              <h2>Panel de Control Moderno</h2>
              <p>Conectado a: {supabaseUrl}</p>
              <div style={{
                marginTop: "20px",
                padding: "40px",
                textAlign: "center",
                background: "white",
                borderRadius: "8px",
                border: "1px dashed #d9d9d9"
              }}>
                <h3>¡Refine está listo!</h3>
                <p>Usa los comandos `npm install` para activar el sistema.</p>
              </div>
            </div>
          </ThemedLayoutV2>
        </Refine>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
