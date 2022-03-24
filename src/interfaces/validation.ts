import { Manifest } from "./manifest";

export interface ManifestDetectionResult {
    manifest: Manifest,
    manifestUri: string
}

export interface ServiceWorkerDetectionResult {
    hasSW: boolean;
    url: string | null;
    hasPushRegistration: boolean;
    serviceWorkerDetectionTimedOut: boolean;
    noServiceWorkerFoundDetails: string | null;
    hasBackgroundSync: boolean;
    hasPeriodicBackgroundSync: boolean;
}

export interface SecurityDataResults {
    isHTTPS: true;
    validProtocol: true;
    valid: true;
}

export interface SiteData {
    manifest: ManifestDetectionResult,
    sw: ServiceWorkerDetectionResult
}