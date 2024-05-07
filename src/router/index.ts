import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import useUserStore from "@stores/user";
import Index from "@pages/Index.vue";
import type { UserType } from "@/types";
import { subscriptionService } from "@/bootstrap";

declare module "vue-router" {
  interface RouteMeta {
    title: string;
    layout?: string;
    containerClass?: string;
    authenticated: UserType[];
    redirectTo?: string;
  }
}

const onlyAdmin: UserType[] = ["ADMIN"];
const onlyGuest: UserType[] = ["GUEST"];
const userAdmin: UserType[] = ["ADMIN", "USER"];

async function hasSubscription(): Promise<boolean> {
  const response = await subscriptionService.getSubscription();

  if (response.meta.success) {
    return response.data.subscriptions.length > 0;
  } else {
    console.log(response.meta.message);
    return false;
  }
}

const routes = setupLayouts([
  {
    path: "/",
    name: "index",
    component: Index,
    meta: {
      title: "Index",
      authenticated: userAdmin,
      redirectTo: "login",
    },
  },
  {
    path: "/logout",
    name: "logout",
    component: Index,
    meta: {
      title: "Index",
      authenticated: userAdmin,
      redirectTo: "login",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@pages/Login.vue"),
    meta: {
      title: "Login",
      layout: "login",
      authenticated: onlyGuest,
      redirectTo: "index",
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@pages/Register.vue"),
    meta: {
      title: "Register",
      layout: "login",
      authenticated: onlyGuest,
      redirectTo: "index",
    },
  },
  {
    path: "/docs",
    children: [
      {
        path: "",
        name: "docs",
        component: () => import("@pages/client/Docs.vue"),
        meta: {
          title: "Docs",
          containerClass: "image-bg",
          authenticated: userAdmin,
        },
      },
      {
        path: `:templateId`,
        name: "generator.docs",
        component: () => import("@pages/client/generator/Docs.vue"),
        props: true,
        meta: {
          title: "Docs Generator",
          authenticated: userAdmin,
        },
      },
      {
        path: `:templateId/:orderId`,
        name: "generator.docs.order",
        component: () => import("@pages/client/generator/Docs.vue"),
        props: true,
        meta: {
          title: "Docs Generator",
          authenticated: userAdmin,
        },
      },
    ],
  },
  {
    path: "/mrz",
    children: [
      {
        path: "",
        name: "mrz",
        component: () => import("@pages/client/MRZ.vue"),
        meta: {
          title: "MRZ",
          containerClass: "image-bg",
          authenticated: userAdmin,
        },
      },
      {
        path: `:templateId`,
        name: "generator.mrz",
        component: () => import("@pages/client/generator/MRZ.vue"),
        props: true,
        meta: {
          title: "MRZ Generator",
          authenticated: userAdmin,
        },
      },
      {
        path: `:templateId/:orderId`,
        name: "generator.mrz.order",
        component: () => import("@pages/client/generator/MRZ.vue"),
        props: true,
        meta: {
          title: "MRZ Generator",
          authenticated: userAdmin,
        },
      },
    ],
  },
  {
    path: "/aamva",
    children: [
      {
        path: "",
        name: "aamva",
        component: () => import("@pages/client/AAMVA.vue"),
        meta: {
          title: "AAMVA",
          containerClass: "image-bg",
          authenticated: userAdmin,
        },
      },
      {
        path: `:templateId`,
        name: "generator.aamva",
        component: () => import("@pages/client/generator/AAMVA.vue"),
        props: true,
        meta: {
          title: "AAMVA Generator",
          authenticated: userAdmin,
        },
      },
      {
        path: `:templateId/:orderId`,
        name: "generator.aamva.order",
        component: () => import("@pages/client/generator/AAMVA.vue"),
        props: true,
        meta: {
          title: "AAMVA Generator",
          authenticated: userAdmin,
        },
      },
    ],
  },
  {
    path: "/pn",
    children: [
      {
        path: "",
        name: "pn",
        component: () => import("@pages/client/PN.vue"),
        meta: {
          title: "PN",
          containerClass: "image-bg",
          authenticated: userAdmin,
        },
      },
      {
        path: `:templateId`,
        name: "generator.pn",
        component: () => import("@pages/client/generator/PN.vue"),
        props: true,
        meta: {
          title: "PN Generator",
          authenticated: userAdmin,
        },
      },
      {
        path: `:templateId/:orderId`,
        name: "generator.pn.order",
        component: () => import("@pages/client/generator/PN.vue"),
        props: true,
        meta: {
          title: "PN Generator",
          authenticated: userAdmin,
        },
      },
    ],
  },
  {
    path: "/orders",
    name: "orders",
    component: () => import("@pages/client/Orders.vue"),
    meta: {
      title: "Orders",
      authenticated: userAdmin,
      containerClass: "image-bg",
    },
  },
  {
    path: "/balance",
    name: "balance",
    component: () => import("@pages/client/Balance.vue"),
    meta: {
      title: "Balance",
      authenticated: userAdmin,
      containerClass: "image-bg",
    },
  },
  {
    path: "/subscription",
    name: "subscription",
    component: () => import("@pages/client/Subscription.vue"),
    meta: {
      title: "Subscription",
      containerClass: "image-bg",
      authenticated: userAdmin,
    },
  },
  {
    path: "/support",
    name: "support",
    component: () => import("@pages/client/Support.vue"),
    meta: {
      title: "Support",
      containerClass: "image-bg",
      authenticated: userAdmin,
    },
  },
  {
    path: "/admin/orders",
    name: "admin.orders",
    component: () => import("@pages/admin/Orders.vue"),
    meta: {
      title: "Orders",
      authenticated: onlyAdmin,
      containerClass: "image-bg",
    },
  },
  {
    path: "/admin/balance",
    name: "admin.balance",
    component: () => import("@pages/admin/Balance.vue"),
    meta: {
      title: "Balance",
      authenticated: onlyAdmin,
      containerClass: "image-bg",
    },
  },
  {
    path: "/admin/templates",
    children: [
      {
        path: "",
        name: "admin.templates.list",
        component: () => import("@pages/admin/templates/TemplatesList.vue"),
        meta: {
          title: "Templates",
          authenticated: onlyAdmin,
          containerClass: "image-bg",
        },
      },
      {
        path: "create",
        name: "admin.templates.create",
        component: () => import("@pages/admin/templates/TemplateCreate.vue"),
        meta: {
          title: "Create Template",
          authenticated: onlyAdmin,
        },
      },
      {
        path: "edit/:id",
        name: "admin.templates.edit",
        component: () => import("@pages/admin/templates/TemplateEdit.vue"),
        props: true,
        meta: {
          title: "Edit Template",
          authenticated: onlyAdmin,
        },
      },
    ],
  },
  {
    path: "/admin/faq",
    name: "admin.faq",
    component: () => import("@pages/admin/FAQEditor.vue"),
    meta: {
      title: "FAQ Editor",
      authenticated: onlyAdmin,
    },
  },
]);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    if (typeof to.name === "string") {
      const store = useUserStore();
      const authenticated = to.meta.authenticated;
      const isAuthenticated = authenticated.includes(store.userType);
      const redirectTo = to.meta?.redirectTo ?? "index";

      // if usertype cannot visit the route
      if (!isAuthenticated) {
        return next({ name: redirectTo });
      }
      if (to.name === "subscription") {
        to.meta.hasSubscription = await hasSubscription();
      }
    }

    // basic behaviour
    next();
  },
);

export default router;
