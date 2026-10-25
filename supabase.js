(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Supabase = {}));
})(this, (function (exports) { 'use strict';

    class SupabaseClient {
        constructor(supabaseUrl, supabaseKey) {
            this.supabaseUrl = supabaseUrl;
            this.supabaseKey = supabaseKey;
            this.restUrl = `${supabaseUrl}/rest/v1`;
        }

        from(table) {
            const url = `${this.restUrl}/${table}`;
            const headers = {
                Authorization: `Bearer ${this.supabaseKey}`,
                apikey: this.supabaseKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            };

            const queryParams = new URLSearchParams();

            const builder = {
                select: (columns = '*') => {
                    queryParams.set('select', columns);
                    return builder;
                },
                order: (column, { ascending = true } = {}) => {
                    queryParams.set('order', `${column}.${ascending ? 'asc' : 'desc'}`);
                    return builder;
                },
                insert: async (values) => {
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(values)
                    });
                    if (!res.ok) return { data: null, error: await res.json() };
                    return { data: await res.json(), error: null };
                },
                then: async (onfulfilled) => {
                    try {
                        const finalUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
                        const res = await fetch(finalUrl, { method: 'GET', headers: headers });
                        if (!res.ok) return onfulfilled({ data: null, error: await res.json() });
                        return onfulfilled({ data: await res.json(), error: null });
                    } catch (err) {
                        return onfulfilled({ data: null, error: err });
                    }
                }
            };
            return builder;
        }
    }

    function createClient(supabaseUrl, supabaseKey) {
        return new SupabaseClient(supabaseUrl, supabaseKey);
    }

    exports.SupabaseClient = SupabaseClient;
    exports.createClient = createClient;
    Object.defineProperty(exports, '__esModule', { value: true });
}));
