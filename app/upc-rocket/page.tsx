"use client";
import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import { getItem, updateItem } from "../lightspeed-operations";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Item } from "../lightspeed-types";
import { useEffect, useState } from "react";

export default function UpcRocket() {
  const [item, setItem] = useState<Item | null>(null);
  const [skuField, setSkuField] = useState<string>("");
  const [upcField, setUpcField] = useState<string>("");

  useEffect(() => {
    focusOnSku();
  }, []);

  function focusOnUpc() {
    setTimeout(() => {
      const input = document.querySelector(
        "input[name=UPC]"
      ) as HTMLInputElement;
      input.focus();
    });
  }

  function focusOnSku() {
    setTimeout(() => {
      const input = document.querySelector(
        "input[name=SKU]"
      ) as HTMLInputElement;
      input.focus();
    });
  }

  function resetForm() {
    setSkuField("");
    setUpcField("");
    setItem(null);
    focusOnSku();
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
        window.alert(`Api error: ${error}`);
      }
      setItem(item);
      focusOnUpc();
    } else {
      const upc = formData.get("UPC") as string;
      const upcRegex = /^[0-9]{12}$/;
      if (!upcRegex.test(upc)) {
        window.alert("Invalid UPC format. Please enter a valid UPC.");
        return;
      }

      const itemPayload = {
        itemID: item?.itemID as string,
        upc: upc,
      } as Item;

      const { error } = await updateItem(itemPayload);
      if (error) {
        window.alert(`Api error: ${error}`);
        return;
      }
      setItem(null);
      resetForm();
      focusOnSku();
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
                  <label className="mb-3 block text-black dark:text-white">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="SKU"
                    value={skuField}
                    onChange={(e) => setSkuField(e.target.value)}
                    disabled={item !== null}
                    //autoFocus={item === null}
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
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  {{ item } ? "Search" : "Update Item"}
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
