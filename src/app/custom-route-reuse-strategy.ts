import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  storedRouteHandles = new Map<string, DetachedRouteHandle>();
  from = '';
  to = '';

  shouldReuseRoute(from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot): boolean {
    // return true; // 如果这样，url会变，但是不会跳转
    console.log(from.routeConfig, to.routeConfig);
    console.log('shouldReuseRoute', from.routeConfig === to.routeConfig);
    if (from.routeConfig) {
      this.from = this.getPath(from);
    }
    if (to.routeConfig) {
      this.to = this.getPath(to);
    }
    return from.routeConfig === to.routeConfig;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    console.log('to: ' + this.to);
    const f = this.to.indexOf('edit') > 0;
    console.log('shouldDetach', f, this.from, this.to, route);
    return f;
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    console.log('store', detachedTree);
    this.storedRouteHandles.set(this.getPath(route), detachedTree);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    console.log('retrieve', this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle);
    return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getPath(route);
    console.log('shouldAttach', this.storedRouteHandles.has(path), route);
    // return this.from === 'abc' && this.to === 'index';  下面这个也行
    return !!this.storedRouteHandles.get(path);
  }

  private getPath(route: ActivatedRouteSnapshot): string {
    if (route.routeConfig !== null && route.routeConfig.path !== null) {
      return route.routeConfig.path;
    }
    return '';
  }
}
