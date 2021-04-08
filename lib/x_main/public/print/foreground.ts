import { render, h } from "preact"

import { foregroundOutsideFeature } from "../../x_outside_feature/common"

import { newPrintView } from "../../../noshi/action_print/init"

import { PrintEntry } from "../../../noshi/action_print/x_preact/print"

render(h(PrintEntry, newPrintView(foregroundOutsideFeature())), document.body)
