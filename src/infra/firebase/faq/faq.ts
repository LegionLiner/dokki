import type { FAQInfra, Response, ResponseMeta } from "@infra/types";
import { db, collection, getDocs, setDoc, doc } from "@plugins/firebase";
import type { Tree } from "@infra/firebase/types";
import type { FaqItem } from "@/services/types";

export default class FAQFirebaseInfra implements FAQInfra {
  public async get(): Promise<Response> {
    const ref = collection(db, "tree");
    const snapshot = await getDocs(ref);
    let data;
    const meta: ResponseMeta = {
      errors: [],
      message: "ok",
      status: 200,
      success: true,
    };

    snapshot.forEach((doc) => (data = (doc.data() as Tree).tree));

    if (!data) {
      const message = "Data not found";
      const code = 404;

      meta.errors = [
        {
          message,
          code,
        },
      ];
      meta.message = message;
      meta.status = code;
      meta.success = false;
    }

    return {
      data,
      meta,
    };
  }

  public async store(data: FaqItem[]): Promise<Response> {
    const ref = doc(db, "tree", "OzYJnhOycyv40GyqqMCl");

    await setDoc(ref, { tree: data });

    return {
      data: undefined,
      meta: {
        errors: [],
        message: "ok",
        status: 200,
        success: true,
      },
    };
  }
}
