import * as Yup from "yup";

export const ProdCodeAddSchema = Yup.object().shape({
  psprdcde: Yup.string()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprddsc: Yup.string()
    .max(150, "Length cannot more than 150")
    .required("Field is required"),
  psprdlds: Yup.string()
    .nullable()
    .max(150, "Length cannot more than 150")
    .required("Field is required"),
  // psprdsts: Yup.string().max(150, "Length cannot more than 150").required("Field is required"),
  // psprdstd: Yup.string().max(10, "Length cannot more than 10"),
  psprdggc: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprdlgc: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprdagm: Yup.number().nullable(),

  psprdagn: Yup.number()
    .nullable()
    .test(
      "age",
      "Minimum Borrower Age must be less than Maximum Borrower Age",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprdagm")) as string;
        if (parseInt(typeValue) && value && value > parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprdalm: Yup.number().nullable(),
  psprdaln: Yup.number()
    .nullable()
    .test(
      "limit",
      "Minimum Approved Limit must be less than Maximum Approved Limit",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprdalm")) as string;
        if (parseInt(typeValue) && value && value > parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprdtv1: Yup.number()
    .nullable()
    .test("tenure", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdtv2")) as string;
      if (typeValue && !value && value !== 0) {
        return false;
      } else {
        return true;
      }
    }),
  psprdtv3: Yup.number()
    .nullable()
    .test("tenure", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdtv4")) as string;
      if (typeValue && !value && value !== 0) {
        return false;
      } else {
        return true;
      }
    })
    .test(
      "tenure",
      "Minimum Tenure must be less than Maximum Tenure",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprdtv1")) as string;
        if (parseInt(typeValue) && value && value > parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprdram: Yup.number().nullable(),
  psprdran: Yup.number()
    .nullable()
    .test(
      "rate",
      "Minimum Rate must be less than Maximum Rate",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprdram")) as string;
        if (parseInt(typeValue) && value && value > parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprdpfv: Yup.number()
    .nullable()
    .test("payment frequency", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdpft")) as string;
      if (
        typeValue && !value && value !== 0

      ) {
        return false;
      } else {
        return true;
      }
    }),
  psprdtv2: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .test("tenure", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdtv1")) as string;
      if (
        (typeValue && !value) ||
        (typeValue && value && parseInt(typeValue) === 0)
      ) {
        return false;
      } else {
        return true;
      }
    }),
  psprdtv4: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .test("tenure", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdtv3")) as string;
      if (
        (typeValue && !value) ||
        (typeValue && value && parseInt(typeValue) === 0)
      ) {
        return false;
      } else {
        return true;
      }
    }),
  psprdpcd: Yup.string().nullable().max(10, "Length cannot more than 10"),
  psprdabt: Yup.string().nullable().max(10, "Length cannot more than 10"),
  psprdpft: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .test("payment frequency", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdpfv")) as string;
      if (
        (typeValue && !value) ||
        (typeValue && value && parseInt(typeValue) === 0)
      ) {
        return false;
      } else {
        return true;
      }
    }),
  psprdfpd: Yup.string().nullable(),
  psprditb: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprdmoi: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprdba: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprdamm: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .test("amortization", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprditb")) as string;
      if (typeValue === "FLTRT" && !value) {
        return false;
      } else {
        return true;
      }
    }),
  psprdaip: Yup.string().max(1, "Length cannot more than 1"),
  psprdafe: Yup.string().max(1, "Length cannot more than 1"),
  // psprdsp1: Yup.string().max(1, "Length cannot more than 1"),
  // psprdsp2: Yup.string().max(1, "Length cannot more than 1"),
  // psprdsp3: Yup.string().max(1, "Length cannot more than 1"),
  // psprdsp4: Yup.string().max(1, "Length cannot more than 1"),
  // psprdsp5: Yup.string().max(1, "Length cannot more than 1"),
  psprddr1: Yup.string().max(1, "Length cannot more than 1"),
  psprddr2: Yup.string().max(1, "Length cannot more than 1"),
  psprddr3: Yup.string().max(1, "Length cannot more than 1"),
  psprddr4: Yup.string().max(1, "Length cannot more than 1"),
  psprddo1: Yup.number().nullable(),

  psprddo2: Yup.number()
    .nullable()
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo1")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprddo3: Yup.number()
    .nullable()
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo1")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    )
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo2")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprddo4: Yup.number()
    .nullable()
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo1")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    )
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo2")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    )
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo3")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprdnpm: Yup.number().nullable(),
  psprdnpd: Yup.number().nullable(),
  psprdprm: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
});
export const ProdCodeUpdateSchema = Yup.object().shape({
  psprdcde: Yup.string()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprddsc: Yup.string()
    .max(150, "Length cannot more than 150")
    .required("Field is required"),
  psprdlds: Yup.string()
    .nullable()
    .max(150, "Length cannot more than 150")
    .required("Field is required"),
  psprdsts: Yup.string().max(10, "Length cannot more than 10").optional(),
  // psprdstd: Yup.string().max(10, "Length cannot more than 10"),
  psprdggc: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprdlgc: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprdagm: Yup.number().nullable(),

  psprdagn: Yup.number()
    .nullable()
    .test(
      "age",
      "Minimum Borrower Age must be less than Maximum Borrower Age",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprdagm")) as string;
        if (parseInt(typeValue) && value && value > parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprdalm: Yup.number().nullable(),
  psprdaln: Yup.number()
    .nullable()
    .test(
      "limit",
      "Minimum Approved Limit must be less than Maximum Approved Limit",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprdalm")) as string;
        if (parseInt(typeValue) && value && value > parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprdtv1: Yup.number()
    .nullable()
    .test("tenure", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdtv2")) as string;
      if (typeValue && !value && value !== 0) {
        return false;
      } else {
        return true;
      }
    }),
  psprdtv3: Yup.number()
    .nullable()
    .test("tenure", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdtv4")) as string;
      if (typeValue && !value && value !== 0) {
        return false;
      } else {
        return true;
      }
    })
    .test(
      "tenure",
      "Minimum Tenure must be less than Maximum Tenure",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprdtv1")) as string;
        if (parseInt(typeValue) && value && value > parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprdram: Yup.number().nullable(),
  psprdran: Yup.number()
    .nullable()
    .test(
      "rate",
      "Minimum Rate must be less than Maximum Rate",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprdram")) as string;
        if (parseInt(typeValue) && value && value > parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprdpfv: Yup.number()
    .nullable()
    .test("payment frequency", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdpft")) as string;
      if (
        (typeValue && !value && value !== 0)
      ) {
        return false;
      } else {
        return true;
      }
    }),
  psprdtv2: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .test("tenure", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdtv1")) as string;
      if (
        (typeValue && !value) ||
        (typeValue && value && parseInt(typeValue) === 0)
      ) {
        return false;
      } else {
        return true;
      }
    }),
  psprdtv4: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .test("tenure", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdtv3")) as string;
      if (
        (typeValue && !value) ||
        (typeValue && value && parseInt(typeValue) === 0)
      ) {
        return false;
      } else {
        return true;
      }
    }),
  psprdpcd: Yup.string().nullable().max(10, "Length cannot more than 10"),
  psprdpft: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .test("payment frequency", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprdpfv")) as string;
      if (
        (typeValue && !value) ||
        (typeValue && value && parseInt(typeValue) === 0)
      ) {
        return false;
      } else {
        return true;
      }
    }),
  psprdfpd: Yup.string().nullable(),
  psprditb: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprdmoi: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprdba: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psprdamm: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .test("amortization", "Field is required", function (value) {
      const typeValue = this.resolve(Yup.ref("psprditb")) as string;
      if (typeValue === "FLTRT" && !value) {
        return false;
      } else {
        return true;
      }
    }),
  psprdaip: Yup.string().max(1, "Length cannot more than 1"),
  psprdafe: Yup.string().max(1, "Length cannot more than 1"),
  psprdsp1: Yup.string().max(10, "Length cannot more than 10"),
  psprdsp2: Yup.string().max(10, "Length cannot more than 10"),
  psprdsp3: Yup.string().max(10, "Length cannot more than 10"),
  psprdsp4: Yup.string().max(10, "Length cannot more than 10"),
  psprdsp5: Yup.string().max(10, "Length cannot more than 10"),
  psprddr1: Yup.string().max(1, "Length cannot more than 1"),
  psprddr2: Yup.string().max(1, "Length cannot more than 1"),
  psprddr3: Yup.string().max(1, "Length cannot more than 1"),
  psprddr4: Yup.string().max(1, "Length cannot more than 1"),
  psprddo1: Yup.number().nullable(),

  psprddo2: Yup.number()
    .nullable()
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo1")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprddo3: Yup.number()
    .nullable()
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo1")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    )
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo2")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprddo4: Yup.number()
    .nullable()
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo1")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    )
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo2")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    )
    .test(
      "pastdue",
      "Must be greater than previous Days in Overdue",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psprddo3")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value < parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
  psprdnpm: Yup.number().nullable(),
  psprdnpd: Yup.number().nullable(),
  psprdprm: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
});
