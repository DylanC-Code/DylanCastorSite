import type { AfterFirstTestViewModel } from "#/presentation/visitor/agencies/viewmodels/AfterFirstTestViewModel.ts";
import type { ClosingAskViewModel } from "#/presentation/visitor/agencies/viewmodels/ClosingAskViewModel.ts";
import type { MethodBandViewModel } from "#/presentation/visitor/agencies/viewmodels/MethodBandViewModel.ts";
import type { UnderYourNameViewModel } from "#/presentation/visitor/agencies/viewmodels/UnderYourNameViewModel.ts";

/** The agencies home's four sections after the steps, in page order. */
export interface AgencySectionsViewModel {
    readonly underYourName: UnderYourNameViewModel;
    readonly afterFirstTest: AfterFirstTestViewModel;
    readonly method: MethodBandViewModel;
    readonly ask: ClosingAskViewModel;
}
