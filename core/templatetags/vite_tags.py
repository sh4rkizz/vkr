from django import template
from django.utils.safestring import mark_safe

register = template.Library()

@register.simple_tag
def vite_hmr():
    return mark_safe("""
    <script type="module" src="http://localhost:5173/@vite/client"></script>
    <script type="module">
      import RefreshRuntime from 'http://localhost:5173/@react-refresh'
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>
    """)
