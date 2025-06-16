import * as Yup from "yup";

const contactNoRegExp = /^(?:[0-9]?){14}[0-9]$/;
const emailRegExp = /^\w+(?:[.-]\w+)*@\w+(?:[.-]\w+)*(?:\.\w{2,3})+$/;

export const ApplicationSchema = [
  Yup.object().shape({
    
  }),
  Yup.object().shape({
    psaplaid: Yup.string()
      .nullable()
      .max(25, "Length cannot more than 25")
      .required("Field is required"),
    psaplamt: Yup.number().nullable().required("Field is required"),
    psaplpir: Yup.number().nullable().required("Field is required"),
    psapltnc: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required"),
    psapltnv: Yup.number().nullable().required("Field is required"),
  }),
  Yup.object().shape({
    pscifuid: Yup.string().nullable().max(50, "Length cannot more than 25"),
    psapltyp: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required"),
    psaplnme: Yup.string()
      .nullable()
      .max(255, "Length cannot more than 255")
      .required("Field is required"),
    psaplidt: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required"),
    psaplidn: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required"),
    psapldob: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required"),
    psaplgen: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required"),
    psaplrce: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required"),
    psaplrco: Yup.string().nullable().max(10, "Length cannot more than 10"),
    psaplctz: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required"),
    psaplbnc: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required"),
    psaplbna: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required")
      .test("bankAcc", "Invalid Format", function (value) {
        if (isNaN(Number(value))) {
          return false;
        } else {
          return true;
        }
      }),
    psaplcnm: Yup.string()
      .nullable()
      .max(50, "Length cannot more than 50")
      .required("Field is required")
      .matches(contactNoRegExp, "Invalid Contact No. format"),
    psaplcem: Yup.string()
      .nullable()
      .max(255, "Length cannot more than 255")
      .required("Field is required")
      .matches(emailRegExp, "Invalid Email format"),
    psaplrd1: Yup.string()
      .nullable()
      .max(255, "Length cannot more than 255")
      .required("Field is required"),
    psaplrdp: Yup.string()
      .nullable()
      .max(5, "Length cannot more than 5")
      .required("Field is required")
      .test("postalCode", "Invalid Format", function (value) {
        if (isNaN(Number(value))) {
          return false;
        } else {
          return true;
        }
      }),
    psaplrdc: Yup.string()
      .nullable()
      .max(50, "Length cannot more than 50")
      .required("Field is required"),
    psaplrds: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required"),
    psaplhd1: Yup.string()
      .nullable()
      .max(255, "Length cannot more than 255")
      .required("Field is required"),
    psaplhd2: Yup.string().nullable().max(255, "Length cannot more than 255"),
    psaplhdp: Yup.string()
      .nullable()
      .max(5, "Length cannot more than 5")
      .test("postalCode", "Invalid Format", function (value) {
        if (isNaN(Number(value))) {
          return false;
        } else {
          return true;
        }
      }),
    psaplhdc: Yup.string()
      .nullable()
      .max(50, "Length cannot more than 50")
      .required("Field is required"),

    psaplhds: Yup.string()
      .nullable()
      .max(10, "Length cannot more than 10")
      .required("Field is required"),

    psaplec1: Yup.string()
      .nullable()
      .max(255, "Length cannot more than 255")
      .required("Field is required"),
    psaplec2: Yup.string().nullable().max(255, "Length cannot more than 255"),
    psapler2: Yup.string().nullable().max(10, "Length cannot more than 10"),
    psaplscn: Yup.string().nullable().max(255, "Length cannot more than 255"),
    psaplsit: Yup.string()
      .nullable()
      .test("spouse", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psaplscn")) as string;
        if (typeValue && !value) {
          return false;
        } else {
          return true;
        }
      })
      .max(10, "Length cannot more than 10"),
    psaplsin: Yup.string()
      .nullable()
      .test("spouse", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psaplscn")) as string;
        if (typeValue && !value) {
          return false;
        } else {
          return true;
        }
      })
      .max(50, "Length cannot more than 50"),
    psaplsph: Yup.string()
      .nullable()
      .test("spouse", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psaplscn")) as string;
        if (typeValue && !value) {
          return false;
        } else {
          return true;
        }
      })
      .test("spouse", "Invalid Contact No. format", function (value) {
        const typeValue = this.resolve(Yup.ref("psaplscn")) as string;
        if (typeValue && !value && !contactNoRegExp.test(value || "")) {
          return false;
        } else {
          return true;
        }
      })
      .max(50, "Length cannot more than 50"),
    psaplsem: Yup.string()
      .nullable()
      .test("spouse", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psaplscn")) as string;
        if (typeValue && !value) {
          return false;
        } else {
          return true;
        }
      })
      .test("spouse", "Invalid Email format", function (value) {
        const typeValue = this.resolve(Yup.ref("psaplscn")) as string;
        if (typeValue && !value && !contactNoRegExp.test(value || "")) {
          return false;
        } else {
          return true;
        }
      })
      .max(255, "Length cannot more than 255"),
    psaplscp: Yup.string()
      .nullable()
      .max(255, "Length cannot more than 255")
      .required("Field is required"),
    psaplsof: Yup.string()
      .nullable()
      .test("spouse", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psaplscn")) as string;
        if (typeValue && !value) {
          return false;
        } else {
          return true;
        }
      })
      .test("spouse", "Invalid Contact No. format", function (value) {
        const typeValue = this.resolve(Yup.ref("psaplscn")) as string;
        if (typeValue && !value && !contactNoRegExp.test(value || "")) {
          return false;
        } else {
          return true;
        }
      })
      .max(50, "Length cannot more than 50"),
    psaplsa1: Yup.string()
      .nullable()
      .max(255, "Length cannot more than 255")
      .required("Field is required"),
    psaplsa2: Yup.string().nullable().max(255, "Length cannot more than 255"),
    psaplsap: Yup.string()
      .nullable()
      .max(5, "Length cannot more than 5")
      .test("spouse", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psaplscn")) as string;
        if (typeValue && !value) {
          return false;
        } else {
          return true;
        }
      })
      .test("postalCode", "Invalid Format", function (value) {
        if (isNaN(Number(value))) {
          return false;
        } else {
          return true;
        }
      }),
    psaplsac: Yup.string()
      .nullable()
      .test("spouse", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psaplscn")) as string;
        if (typeValue && !value) {
          return false;
        } else {
          return true;
        }
      })
      .max(50, "Length cannot more than 50"),
    psaplsas: Yup.string()
      .nullable()
      .test("spouse", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psaplscn")) as string;
        if (typeValue && !value) {
          return false;
        } else {
          return true;
        }
      })
      .max(10, "Length cannot more than 10"),
  }),
  Yup.object().shape({
    psemptyp: Yup.string()
      .nullable()

      .max(50, "Length cannot more than 50")
      .required("Field is required"),
    psempctp: Yup.string()
      .nullable()
      .test("employment", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value) {
          return false;
        } else {
          return true;
        }
      })
      .max(10, "Length cannot more than 10"),
    psempcnm: Yup.string()
      .nullable()
      .test("employment", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value) {
          return false;
        } else {
          return true;
        }
      })
      .max(10, "Length cannot more than 10"),
    psempdjt: Yup.string()
      .nullable()
      .test("employment", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value) {
          return false;
        } else {
          return true;
        }
      }),
    psemppos: Yup.string()
      .nullable()
      .test("employment", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value) {
          return false;
        } else {
          return true;
        }
      })
      .max(10, "Length cannot more than 10"),
    psempmsl: Yup.number()
      .nullable()
      .test("employment", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value) {
          return false;
        } else {
          return true;
        }
      }),
    psempspd: Yup.string()
      .nullable()
      .test("employment", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value) {
          return false;
        } else {
          return true;
        }
      })
      .test("day", "Invalid Format", function (value) {
        if (isNaN(Number(value))) {
          return false;
        } else {
          return true;
        }
      })
      .max(2, "Length cannot more than 2"),

    pscomtno: Yup.string()
      .nullable()
      .test("employment", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value) {
          return false;
        } else {
          return true;
        }
      })
      .test("phoneNo", "Invalid Contact No. format", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value && !contactNoRegExp.test(value || "")) {
          return false;
        } else {
          return true;
        }
      })
      .max(50, "Length cannot more than 50"),
    pscomad1: Yup.string()
      .nullable()
      .test("employment", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value) {
          return false;
        } else {
          return true;
        }
      })

      .max(255, "Length cannot more than 255"),
    pscomad2: Yup.string()
      .nullable()

      .max(255, "Length cannot more than 255"),
    pscomadp: Yup.string()
      .nullable()
      .test("employment", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value) {
          return false;
        } else {
          return true;
        }
      })

      .max(255, "Length cannot more than 255")
      .test("postalCode", "Invalid Format", function (value) {
        if (isNaN(Number(value))) {
          return false;
        } else {
          return true;
        }
      }),
    pscomadc: Yup.string()
      .nullable()
      .test("employment", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value) {
          return false;
        } else {
          return true;
        }
      })

      .max(50, "Length cannot more than 50"),
    pscomads: Yup.string()
      .nullable()
      .test("employment", "Field is required", function (value) {
        const typeValue = this.resolve(Yup.ref("psemptyp")) as string;
        if (typeValue !== "S" && !value) {
          return false;
        } else {
          return true;
        }
      })

      .max(10, "Length cannot more than 10"),
  }),
  Yup.object().shape({
    
  }),
  Yup.object().shape({
    
  }),
];
