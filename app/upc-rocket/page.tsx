"use client";
import { getItem, updateItem } from "../lightspeed-operations";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Item } from "../lightspeed-types";
import { useEffect, useState } from "react";
import Alert, { AlertProps } from "@/components/Alert/alert";

export default function UpcRocket() {
  const [item, setItem] = useState<Item | null>(null);
  const [skuField, setSkuField] = useState<string>("");
  const [upcField, setUpcField] = useState<string>("");
  const [alertBox, setAlertBox] = useState<AlertProps>({
    title: "",
    content: "",
    type: "warning",
  });

  useEffect(() => {
    focusOnInput("SKU");
  }, []);

  function focusOnInput(inputName: string) {
    setTimeout(() => {
      const input = document.querySelector(
        `input[name=${inputName}]`
      ) as HTMLInputElement;
      input.focus();
    }, 200);
  }

  function resetForm() {
    setSkuField("");
    setUpcField("");
    setItem(null);
    setAlertBox({
      title: "",
      content: "",
      type: "warning",
    });
    focusOnInput("SKU");
  }

  async function onSubmit(formData: FormData) {
    if (item === null) {
      const sku = formData.get("SKU") as string;
      if (!sku) {
        resetForm();
        return;
      }
      const { item, error } = await getItem({ customSku: sku });
      if (error) {
        setAlertBox({
          title: "Error",
          content: `Api error: ${error}`,
          type: "error",
        });
        return;
      }
      setItem(item);
      focusOnInput("UPC");
    } else {
      const upc = formData.get("UPC") as string;
      const upcRegex = /^[0-9]{12}$/;
      if (!upcRegex.test(upc)) {
        setAlertBox({
          title: "UPC Invalid Format",
          content: `Invalid UPC format. Please enter a valid UPC.`,
          type: "warning",
        });
        setUpcField("");
        focusOnInput("UPC");
        return;
      }

      const itemPayload = {
        itemID: item?.itemID as string,
        upc: upc,
      } as Item;

      const { error } = await updateItem(itemPayload);
      if (error) {
        setAlertBox({
          title: "Error",
          content: `Api error: ${error}`,
          type: "error",
        });
        return;
      }
      setItem(null);
      resetForm();
      focusOnInput("SKU");
    }
  }

  return (
    <div>
      <Breadcrumb pageName="UPC Rocket" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <form action={onSubmit}>
            {/* <!-- Input Fields --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  {alertBox && (
                    <Alert
                      title={alertBox.title}
                      content={alertBox.content}
                      type={alertBox.type}
                    />
                  )}
                  <label className="mb-3 block text-black dark:text-white">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="SKU"
                    value={skuField}
                    onChange={(e) => setSkuField(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <div hidden={item === null}>
                  {/* display item name */}
                  <label className="mb-3 block text-black dark:text-white">
                    Item Name : {item?.description}
                  </label>
                  <label className="mb-3 block text-black dark:text-white">
                    UPC
                  </label>
                  <input
                    type="text"
                    name="UPC"
                    value={upcField}
                    onChange={(e) => setUpcField(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {item?.upc && (
                    <Alert
                      title="Alert"
                      content={`UPC code already exists for this item : ${item?.upc}`}
                      type="warning"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  {item === null ? "Search" : "Update Item"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-md border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
